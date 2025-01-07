from django.test import TestCase
from core.models import Family, Child, Classroom
from core.serializers import ChildSerializer

class TestChildSerializer(TestCase):
    def setUp(self):
        # Set up test data for the Family model
        self.family = Family.objects.create(parent_1_name="Test Parent")

        # Set up test data for the Classroom model, include max_capacity
        self.classroom = Classroom.objects.create(
            classroom_name="Test Classroom",
            max_capacity=10,  # Provide a valid value for max_capacity
        )

    def test_family_field_in_child_serializer(self):
        # Create valid data with family as a primary key
        data = {
            "first_name": "Test",
            "last_name": "Child",
            "date_of_birth": "2025-01-01",
            "classroom": self.classroom.id,
            "family": self.family.id,
            "enrollment_start_date": "2025-01-10",
        }
        serializer = ChildSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["family"], self.family)
