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
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    enrollment_start_date = models.DateField()
    enrollment_end_date = models.DateField(null=True, blank=True)  # New field
    classroom = models.ForeignKey(
        "Classroom",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
    )
    family = models.ForeignKey(
        "Family",
        on_delete=models.CASCADE,
        related_name="children",
    )
    fob_required = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    allergy_info = models.TextField(blank=True, null=True)
    emergency_contact = models.TextField(blank=True, null=True)

    def age_in_months_at_start(self):
        if self.enrollment_start_date and self.date_of_birth:
            return (
                (self.enrollment_start_date.year - self.date_of_birth.year) * 12
                + (self.enrollment_start_date.month - self.date_of_birth.month)
            )
        return None

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Classroom(models.Model):
    classroom_name = models.CharField(max_length=100)
    program_type = models.CharField(max_length=50, choices=[
        ('Infant', 'Infant'),
        ('Toddler', 'Toddler'),
        ('Preschool', 'Preschool'),
    ])
    max_capacity = models.PositiveIntegerField()
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.classroom_name


class AlternativeCapacity(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='alternative_capacities')
    program_type = models.CharField(max_length=100)
    max_capacity = models.IntegerField()

    def __str__(self):
        return f"{self.classroom.classroom_name} - {self.program_type} ({self.max_capacity})"  # Update `__str__`



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
        return f"Payment {self.id} of ${self.amount_paid} by Family {self.family.id}"


class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    date_issued = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    full_tuition = models.DecimalField(max_digits=10, decimal_places=2)
    subsidy_amount = models.DecimalField(max_digits=10, decimal_places=2)
    parent_portion = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ("Unpaid", "Unpaid"),
            ("Partially Paid", "Partially Paid"),
            ("Paid", "Paid"),
        ],
        default="Unpaid",
    )
    notes = models.TextField(blank=True, null=True)
    child = models.ForeignKey("Child", on_delete=models.CASCADE)
    family = models.ForeignKey("Family", on_delete=models.CASCADE)

    def clean(self):
        # Ensure full_tuition equals the sum of parent_portion and subsidy_amount
        if self.parent_portion + self.subsidy_amount != self.full_tuition:
            raise ValidationError("Full tuition must equal the sum of parent and subsidy amounts.")

        # Ensure paid_amount does not exceed the parent_portion
        if self.paid_amount > self.parent_portion:
            raise ValidationError("Paid amount cannot exceed the parent portion.")

    def __str__(self):
        return f"Invoice {self.invoice_id} for Child {self.child}"

class GovernmentFunding(models.Model):
    funding_source = models.CharField(max_length=255)
    stream = models.CharField(max_length=255)
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    date_received = models.DateField()
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.funding_source} - {self.stream}"

class Deposit(models.Model):
    DEPOSIT_STATUS_CHOICES = [
        ('Owing', 'Owing'),
        ('Paid', 'Paid'),
        ('Refunded', 'Refunded'),
        ('Forfeited', 'Forfeited'),
    ]

    deposit_id = models.AutoField(primary_key=True)
    child = models.ForeignKey('Child', on_delete=models.CASCADE, related_name='deposits')
    deposit_type = models.CharField(max_length=50, choices=[('Security', 'Security'), ('FOB', 'FOB')])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=DEPOSIT_STATUS_CHOICES, default='Owing')
    date_collected = models.DateField(null=True, blank=True)
    date_refunded = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.deposit_type} deposit for {self.child} ({self.status})"


class Calendar(models.Model):
    date = models.DateField(unique=True)
    is_weekday = models.BooleanField(default=True)
    is_stat_holiday = models.BooleanField(default=False)
    stat_substitution_date = models.DateField(null=True, blank=True)  # New field
    is_closed = models.BooleanField(default=False)

    def __str__(self):
        return f"Date: {self.date}, Closed: {self.is_closed}"

class SubsidyRate(models.Model):
    program_type = models.CharField(max_length=50)  # Infant, Toddler, Preschool
    daily_tuition_rate = models.DecimalField(max_digits=6, decimal_places=2)  # Full daily tuition
    parent_daily_cap = models.DecimalField(max_digits=6, decimal_places=2)  # Max parent pays per day
    government_daily_subsidy = models.DecimalField(max_digits=6, decimal_places=2)  # Subsidy amount

    def save(self, *args, **kwargs):
        # Automatically calculate subsidy if not provided
        if not self.government_daily_subsidy:
            self.government_daily_subsidy = self.daily_tuition_rate - self.parent_daily_cap
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.program_type} - Daily Tuition: ${self.daily_tuition_rate}"

