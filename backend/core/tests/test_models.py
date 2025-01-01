from django.test import TestCase
from core.models import SampleModel  # Import the model from the core app

class SampleModelTestCase(TestCase):
    def test_sample_model_creation(self):
        obj = SampleModel.objects.create(name="Test Name", description="Test Description")
        self.assertEqual(obj.name, "Test Name")
        self.assertEqual(obj.description, "Test Description")
