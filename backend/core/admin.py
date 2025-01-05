# core/admin.py
from django.contrib import admin
from .models import Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding, Deposit, Calendar

# Register models
admin.site.register(Family)
admin.site.register(Child)
admin.site.register(Classroom)
admin.site.register(Attendance)
admin.site.register(Payment)
admin.site.register(Invoice)
admin.site.register(GovernmentFunding)
admin.site.register(Deposit)

@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    list_display = ('date', 'is_stat_holiday', 'is_closed', 'stat_substitution_date')
    list_filter = ('is_stat_holiday', 'is_closed')
    search_fields = ('date',)
