from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from core.models import Transition, Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding, AlternativeCapacity
from core.serializers import ChildDropdownSerializer, TransitionSerializer, ChildListSerializer, FamilySerializer, ChildSerializer, ClassroomSerializer, AttendanceSerializer, PaymentSerializer, InvoiceSerializer, GovernmentFundingSerializer, AlternativeCapacitySerializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChildSerializer, FamilySerializer

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
