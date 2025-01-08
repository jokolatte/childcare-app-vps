# core/admin.py
from django.contrib import admin
from .models import Transition, Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding, Deposit, Calendar, SubsidyRate

# Register models
admin.site.register(Family)
admin.site.register(Classroom)
admin.site.register(Attendance)
admin.site.register(Payment)
admin.site.register(Invoice)
admin.site.register(GovernmentFunding)
admin.site.register(Deposit)
admin.site.register(SubsidyRate)

@admin.register(Transition)
class TransitionAdmin(admin.ModelAdmin):
    list_display = ('child', 'next_classroom', 'transition_date', 'status')
    search_fields = ('child__first_name', 'child__last_name', 'next_classroom__classroom_name')
    list_filter = ('status', 'transition_date')

@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    list_display = ('date', 'is_stat_holiday', 'is_closed', 'stat_substitution_date')
    list_filter = ('is_stat_holiday', 'is_closed')
    search_fields = ('date',)

@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "date_of_birth",
        "enrollment_start_date",
        "enrollment_end_date",  # Add this to the list
        "classroom",
        "family",
        "fob_required",
    )
    search_fields = ("first_name", "last_name", "family__name")