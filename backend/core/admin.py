# core/admin.py
from django.contrib import admin
from .models import Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding

# Register models
admin.site.register(Family)
admin.site.register(Child)
admin.site.register(Classroom)
admin.site.register(Attendance)
admin.site.register(Payment)
admin.site.register(Invoice)
admin.site.register(GovernmentFunding)