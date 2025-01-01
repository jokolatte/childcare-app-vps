from django.http import JsonResponse
from rest_framework import generics
from core.models import Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding
from core.serializers import FamilySerializer, ChildSerializer, ClassroomSerializer, AttendanceSerializer, PaymentSerializer, InvoiceSerializer, GovernmentFundingSerializer


# Test API Endpoint
def test_api(request):
    return JsonResponse({"message": "Hello from the backend!"})

# CRUD views for Family
class FamilyListCreateView(generics.ListCreateAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer

class FamilyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer

# CRUD views for Child
class ChildListCreateView(generics.ListCreateAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer

class ChildRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer

# CRUD views for Classroom
class ClassroomListCreateView(generics.ListCreateAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

class ClassroomRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

# CRUD views for Attendance
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendanceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

# CRUD views for Payment
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class PaymentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

# CRUD views for Invoice
class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

class InvoiceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

# CRUD views for GovernmentFunding
class GovernmentFundingListCreateView(generics.ListCreateAPIView):
    queryset = GovernmentFunding.objects.all()
    serializer_class = GovernmentFundingSerializer

class GovernmentFundingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GovernmentFunding.objects.all()
    serializer_class = GovernmentFundingSerializer
