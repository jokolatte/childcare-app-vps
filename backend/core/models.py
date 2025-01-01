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
