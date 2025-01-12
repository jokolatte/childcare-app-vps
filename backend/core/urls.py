from django.urls import path, include
from .views import calendar_stats, WithdrawalViewSet, ChildrenListView, ClassroomsListView, FamiliesListView, ClassroomListCreateView, ClassroomRetrieveUpdateDestroyView, AddChildView
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from core.views import (
    upcoming_enrollments,
    classrooms_for_date,
    classroom_attendance,
    get_classrooms,
    calendar_stats,
    WithdrawalViewSet,
    ChildrenDropdownListView,
    TransitionViewSet,
    AddChildView,
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

router = DefaultRouter()
router.register(r'transitions', TransitionViewSet, basename='transition')
router.register(r'withdrawals', WithdrawalViewSet)

urlpatterns = [
    path('upcoming_enrollments/', upcoming_enrollments, name='upcoming_enrollments'),    
    path('api/classroom-attendance-stats', views.classroom_attendance_stats, name='classroom-attendance-stats'),
    path('api/classrooms-for-date', classrooms_for_date, name='classrooms_for_date'),
    path('api/classroom-attendance', classroom_attendance, name='classroom_attendance'),
    path('api/classrooms', get_classrooms, name='get_classrooms'),
    path('api/enrollment/stats/', calendar_stats, name='calendar_stats'),
    path('api/', include(router.urls)),
    path('api/add-child/', AddChildView.as_view(), name='add_child'),
    path('api/families/', FamilyListCreateView.as_view(), name='family-list-create'),
    path('api/families/<int:pk>/', FamilyRetrieveUpdateDestroyView.as_view(), name='family-detail'),
    path('api/children/', ChildListCreateView.as_view(), name='child-list-create'),
    path('api/children/<int:pk>/', ChildRetrieveUpdateDestroyView.as_view(), name='child-detail'),
    path('api/children/', AddChildView.as_view(), name='add_child'),
    path('api/classrooms/', ClassroomListCreateView.as_view(), name='classroom-list-create'),
    path('api/classrooms/<int:pk>/', ClassroomRetrieveUpdateDestroyView.as_view(), name='classroom-detail'),
    path('api/children-list/', ChildrenListView.as_view(), name='children-list'),
    path('children/dropdown/', ChildrenDropdownListView.as_view(), name='children-dropdown-list'),
    path('classrooms-list/', ClassroomsListView.as_view(), name='classrooms_list'),
    path('families-list/', FamiliesListView.as_view(), name='families_list'),
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
] + router.urls
