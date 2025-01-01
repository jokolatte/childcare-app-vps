from django.db import models


class Family(models.Model):
    parent_1_name = models.CharField(max_length=255)
    parent_1_phone = models.CharField(max_length=20)
    parent_1_email = models.EmailField()
    parent_2_name = models.CharField(max_length=255, blank=True, null=True)
    parent_2_phone = models.CharField(max_length=20, blank=True, null=True)
    parent_2_email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    payment_preferences = models.CharField(max_length=20, choices=[
        ('EFT', 'EFT'),
        ('Credit Card', 'Credit Card'),
        ('Cash', 'Cash'),
        ('Cheque', 'Cheque'),
        ('Direct Payment', 'Direct Payment')
    ])
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Family {self.id}: {self.parent_1_name}"


class Child(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="children")
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    allergy_info = models.TextField(blank=True, null=True)
    emergency_contact = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Child {self.id}: {self.name}"


class Classroom(models.Model):
    name = models.CharField(max_length=255)
    capacity = models.IntegerField()

    def __str__(self):
        return self.name


class Attendance(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="attendances")
    date = models.DateField()
    max_capacity = models.IntegerField()
    enrolled_children = models.IntegerField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Attendance for {self.classroom.name} on {self.date}"


class Payment(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="payments")
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="payments", blank=True, null=True)
    payment_date = models.DateField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    method = models.CharField(max_length=20, choices=[
        ('EFT', 'EFT'),
        ('Credit Card', 'Credit Card'),
        ('Cash', 'Cash'),
        ('Cheque', 'Cheque'),
        ('Direct Payment', 'Direct Payment')
    ])
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Payment {self.id} of ${self.amount} by Family {self.family.id}"


class Invoice(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="invoices")
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name="invoices", blank=True, null=True)
    date_issued = models.DateField()
    due_date = models.DateField()
    due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    subsidy_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    payment_status = models.CharField(max_length=20, choices=[
        ('Paid', 'Paid'),
        ('Unpaid', 'Unpaid'),
        ('Partially Paid', 'Partially Paid'),
    ], default='Unpaid')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Invoice {self.id} for Family {self.family.id}"

class GovernmentFunding(models.Model):
    funding_source = models.CharField(max_length=255)
    stream = models.CharField(max_length=255)
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    date_received = models.DateField()
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.funding_source} - {self.stream}"
