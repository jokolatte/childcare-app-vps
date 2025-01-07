from rest_framework import serializers
from core.models import Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding, AlternativeCapacity

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = ['id', 'parent_1_name']

class ChildSerializer(serializers.ModelSerializer):
    family = serializers.PrimaryKeyRelatedField(queryset=Family.objects.all())
    classroom = serializers.StringRelatedField()
    class Meta:
        model = Child
        fields = "__all__"
    def validate_classroom(self, value):
        if not Classroom.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The specified classroom does not exist.")
        return value


class ChildListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ['id', 'first_name', 'last_name']

class AlternativeCapacitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AlternativeCapacity
        fields = ['id', 'classroom', 'program_type', 'max_capacity']

class ClassroomSerializer(serializers.ModelSerializer):
    alternative_capacities = AlternativeCapacitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Classroom
        fields = ['id', 'classroom_name', 'program_type', 'max_capacity', 'alternative_capacities', 'notes']

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class GovernmentFundingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentFunding
        fields = '__all__'
