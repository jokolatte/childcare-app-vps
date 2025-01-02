from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from core.models import Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding
from core.serializers import FamilySerializer, ChildSerializer, ClassroomSerializer, AttendanceSerializer, PaymentSerializer, InvoiceSerializer, GovernmentFundingSerializer


# Test API Endpoint
def test_api(request):
    return JsonResponse({"message": "Hello from the backend!"})


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
