from django.urls import path
from .views import ClassroomListCreateView, ClassroomRetrieveUpdateDestroyView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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

schema_view = get_schema_view(
    openapi.Info(
        title="Childcare API",
        default_version='v1',
        description="API documentation for the Childcare app",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
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
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
