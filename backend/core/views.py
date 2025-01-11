from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from core.models import Calendar, Withdrawal, Transition, Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding, AlternativeCapacity
from core.serializers import WithdrawalSerializer, ChildDropdownSerializer, TransitionSerializer, ChildListSerializer, FamilySerializer, ChildSerializer, ClassroomSerializer, AttendanceSerializer, PaymentSerializer, InvoiceSerializer, GovernmentFundingSerializer, AlternativeCapacitySerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import datetime
from .serializers import ChildSerializer, FamilySerializer
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def classroom_attendance(request):
    # Get classroom_id and date from query parameters
    classroom_id = request.GET.get('classroom_id')
    date_str = request.GET.get('date')
    if not classroom_id or not date_str:
        return Response({"error": "Both classroom_id and date parameters are required."}, status=400)

    from datetime import datetime
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    # Fetch classroom and validate
    try:
        classroom = Classroom.objects.get(id=classroom_id)
    except Classroom.DoesNotExist:
        return Response({"error": "Classroom not found."}, status=404)

    # Fetch children enrolled in the classroom on the specified date
    children = Child.objects.filter(
        Q(enrollment_end_date__isnull=True) | Q(enrollment_end_date__gte=date),
        enrollment_start_date__lte=date,
        classroom=classroom
    )

    data = []
    for child in children:
        age_in_months = (
            (date.year - child.date_of_birth.year) * 12
            + (date.month - child.date_of_birth.month)
        )
        data.append({
            "id": child.id,
            "name": f"{child.first_name} {child.last_name}",
            "date_of_birth": child.date_of_birth,
            "age_in_months": age_in_months,
        })

    return Response(data)

@api_view(['GET'])
def classrooms_for_date(request):
    # Get the date from the query parameter
    date_str = request.GET.get('date')
    if not date_str:
        return Response({"error": "Date parameter is required."}, status=400)

    from datetime import datetime
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    # Fetch classrooms and their stats for the specified date
    classrooms = Classroom.objects.all()
    data = []
    for classroom in classrooms:
        total_enrolled = Child.objects.filter(
            Q(enrollment_end_date__isnull=True) | Q(enrollment_end_date__gte=date),
            enrollment_start_date__lte=date,
            classroom=classroom
        ).count()

        data.append({
            "id": classroom.id,
            "classroom_name": classroom.classroom_name,
            "total_enrolled": total_enrolled,
            "total_capacity": classroom.max_capacity,
        })

    return Response(data)

@api_view(['GET'])
def calendar_stats(request):
    # Get parameters from the request
    classroom_id = request.GET.get('classroom_id', None)
    open_dates = Calendar.objects.filter(is_closed=False).values('date')

    stats = []

    if classroom_id:
        # Filter stats for a specific classroom
        try:
            classroom = Classroom.objects.get(id=classroom_id)
            for entry in open_dates:
                date = entry['date']
                total_enrolled = Child.objects.filter(
                    Q(enrollment_end_date__isnull=True) | Q(enrollment_end_date__gte=date),
                    enrollment_start_date__lte=date,
                    classroom=classroom
                ).count()

                stats.append({
                    "date": date,
                    "total_capacity": classroom.max_capacity,
                    "total_enrolled": total_enrolled,
                })
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found."}, status=404)
    else:
        # Default: Centre-wide stats
        classrooms = Classroom.objects.all()
        total_capacity = sum(c.max_capacity for c in classrooms)

        for entry in open_dates:
            date = entry['date']
            total_enrolled = Child.objects.filter(
                Q(enrollment_end_date__isnull=True) | Q(enrollment_end_date__gte=date),
                enrollment_start_date__lte=date
            ).count()

            stats.append({
                "date": date,
                "total_capacity": total_capacity,
                "total_enrolled": total_enrolled,
            })

    return Response(stats)

@api_view(['GET'])
def get_classrooms(request):
    classrooms = Classroom.objects.all().values('id', 'classroom_name')
    return Response(list(classrooms))

class WithdrawalViewSet(ModelViewSet):
    queryset = Withdrawal.objects.all()
    serializer_class = WithdrawalSerializer

    def create(self, request, *args, **kwargs):
        # Create the withdrawal entry
        response = super().create(request, *args, **kwargs)

        # Update the enrollment_end_date in the child table
        child_id = request.data.get("child")
        withdrawal_date = request.data.get("withdrawal_date")

        if child_id and withdrawal_date:
            child = get_object_or_404(Child, id=child_id)
            child.enrollment_end_date = withdrawal_date
            child.save()

        return response

    def update(self, request, *args, **kwargs):
        # Update the withdrawal entry
        response = super().update(request, *args, **kwargs)

        # Update the enrollment_end_date in the child table
        child_id = request.data.get("child")
        withdrawal_date = request.data.get("withdrawal_date")

        if child_id and withdrawal_date:
            child = get_object_or_404(Child, id=child_id)
            child.enrollment_end_date = withdrawal_date
            child.save()

        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Reset the enrollment_end_date in the child table
        if instance.child:
            child = get_object_or_404(Child, id=instance.child.id)
            child.enrollment_end_date = None
            child.save()

        # Delete the withdrawal entry
        return super().destroy(request, *args, **kwargs)


class ChildrenDropdownListView(ListAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildDropdownSerializer

class TransitionViewSet(ModelViewSet):
    queryset = Transition.objects.all()
    serializer_class = TransitionSerializer

class ChildrenListView(ListAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildListSerializer

class AddChildView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        # Check if it's a new family
        if not data.get('existing_family', True):  # Default to True if key is missing
            # Create a new family if `existing_family` is false
            family_data = {
                'parent_1_name': data.get('parent_1_name'),
                'parent_1_phone': data.get('parent_1_phone'),
                'parent_1_email': data.get('parent_1_email'),
                'parent_2_name': data.get('parent_2_name', ''),
                'parent_2_phone': data.get('parent_2_phone', ''),
                'parent_2_email': data.get('parent_2_email', ''),
                'address': data.get('address'),
                'payment_preferences': data.get('payment_preferences'),
                'notes': data.get('notes', ''),
            }
            family_serializer = FamilySerializer(data=family_data)
            family_serializer.is_valid(raise_exception=True)
            family = family_serializer.save()

            # Add the newly created family ID to the payload
            data['family'] = family.id

        # Now create the child object
        child_serializer = ChildSerializer(data=data)
        child_serializer.is_valid(raise_exception=True)
        child_serializer.save()

        # Return the created child's data
        return Response(child_serializer.data, status=status.HTTP_201_CREATED)


class ClassroomsListView(APIView):
    def get(self, request):
        classrooms = Classroom.objects.all()
        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)

class FamiliesListView(APIView):
    def get(self, request):
        families = Family.objects.all()
        serializer = FamilySerializer(families, many=True)
        return Response(serializer.data)

# CRUD views for Family
class FamilyListCreateView(generics.ListCreateAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['parent_1_name', 'parent_1_email', 'parent_2_name']
    search_fields = ['parent_1_name', 'parent_1_email', 'parent_2_name']
    ordering_fields = ['parent_1_name', 'parent_1_email']
    ordering = ['parent_1_name']  # Default ordering
    permission_classes = [IsAuthenticated]


class FamilyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer


# CRUD views for Child
class ChildListCreateView(generics.ListCreateAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'date_of_birth', 'allergy_info']


class ChildRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer


# CRUD views for Classroom
class ClassroomListCreateView(generics.ListCreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name']


class ClassroomRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer


class AlternativeCapacityListCreateView(generics.ListCreateAPIView):
    queryset = AlternativeCapacity.objects.all()
    serializer_class = AlternativeCapacitySerializer


# CRUD views for Attendance
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['date', 'notes']


class AttendanceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


# CRUD views for Payment
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['payment_date', 'method', 'notes']


class PaymentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


# CRUD views for Invoice
class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['amount', 'date']


class InvoiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


# CRUD views for GovernmentFunding
class GovernmentFundingListCreateView(generics.ListCreateAPIView):
    queryset = GovernmentFunding.objects.all()
    serializer_class = GovernmentFundingSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['funding_source', 'stream', 'notes']


class GovernmentFundingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GovernmentFunding.objects.all()
    serializer_class = GovernmentFundingSerializer
