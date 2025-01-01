from django.urls import path
from core.views import (
    FamilyListCreateView,
    FamilyRetrieveUpdateDestroyView,
    ChildListCreateView,
    ChildRetrieveUpdateDestroyView,
    ClassroomListCreateView,
    ClassroomRetrieveUpdateDestroyView,
    AttendanceListCreateView,
    AttendanceRetrieveUpdateDestroyView,
    PaymentListCreateView,
    PaymentRetrieveUpdateDestroyView,
    InvoiceListCreateView,
    InvoiceRetrieveUpdateDestroyView,
    GovernmentFundingListCreateView,
    GovernmentFundingRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('api/families/', FamilyListCreateView.as_view(), name='family-list-create'),
    path('api/families/<int:pk>/', FamilyRetrieveUpdateDestroyView.as_view(), name='family-detail'),
    path('api/children/', ChildListCreateView.as_view(), name='child-list-create'),
    path('api/children/<int:pk>/', ChildRetrieveUpdateDestroyView.as_view(), name='child-detail'),
    path('api/classrooms/', ClassroomListCreateView.as_view(), name='classroom-list-create'),
    path('api/classrooms/<int:pk>/', ClassroomRetrieveUpdateDestroyView.as_view(), name='classroom-detail'),
    path('api/attendance/', AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('api/attendance/<int:pk>/', AttendanceRetrieveUpdateDestroyView.as_view(), name='attendance-detail'),
    path('api/payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('api/payments/<int:pk>/', PaymentRetrieveUpdateDestroyView.as_view(), name='payment-detail'),
    path('api/invoices/', InvoiceListCreateView.as_view(), name='invoice-list-create'),
    path('api/invoices/<int:pk>/', InvoiceRetrieveUpdateDestroyView.as_view(), name='invoice-detail'),
    path('api/government-funding/', GovernmentFundingListCreateView.as_view(), name='government-funding-list-create'),
    path('api/government-funding/<int:pk>/', GovernmentFundingRetrieveUpdateDestroyView.as_view(), name='government-funding-detail'),
]
