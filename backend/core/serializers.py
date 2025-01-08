from datetime import datetime
from rest_framework import serializers
from core.models import Transition, Family, Child, Classroom, Attendance, Payment, Invoice, GovernmentFunding, AlternativeCapacity

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = [
            'id', 
            'parent_1_name', 
            'parent_1_phone', 
            'parent_1_email', 
            'parent_2_name', 
            'parent_2_phone', 
            'parent_2_email', 
            'address', 
            'payment_preferences', 
            'notes'
        ]

class ChildDropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ['id', 'first_name', 'last_name', 'date_of_birth']  # Only fields needed for the dropdown

class TransitionSerializer(serializers.ModelSerializer):
    child_name = serializers.SerializerMethodField()
    next_classroom_name = serializers.SerializerMethodField()
    age_at_transition = serializers.SerializerMethodField()

    class Meta:
        model = Transition
        fields = ['id', 'child', 'child_name', 'next_classroom', 'next_classroom_name', 'transition_date', 'notes', 'age_at_transition']

    def get_child_name(self, obj):
        return f"{obj.child.first_name} {obj.child.last_name}"

    def get_next_classroom_name(self, obj):
        return obj.next_classroom.classroom_name

    def get_age_at_transition(self, obj):
        # Calculate the child's age in months at the transition date
        if obj.child.date_of_birth and obj.transition_date:
            dob = obj.child.date_of_birth
            transition_date = obj.transition_date
            age_in_months = (transition_date.year - dob.year) * 12 + (transition_date.month - dob.month)
            return age_in_months
        return None

class ChildSerializer(serializers.ModelSerializer):
    family = serializers.PrimaryKeyRelatedField(queryset=Family.objects.all())
    classroom = serializers.PrimaryKeyRelatedField(queryset=Classroom.objects.all())
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
