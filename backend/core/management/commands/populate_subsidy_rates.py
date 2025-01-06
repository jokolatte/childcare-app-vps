from core.models import SubsidyRate

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Populate subsidy rates for each program type"

    def handle(self, *args, **kwargs):
        subsidy_rates = [
            {"program_type": "Infant", "daily_tuition_rate": 110.19, "daily_parent_rate": 22},
            {"program_type": "Toddler", "daily_tuition_rate": 92.31, "daily_parent_rate": 22},
            {"program_type": "Preschool", "daily_tuition_rate": 74.36, "daily_parent_rate": 22},
        ]

        for rate in subsidy_rates:
            daily_CWELCCA_rate = rate["daily_tuition_rate"] - rate["daily_parent_rate"]
            SubsidyRate.objects.update_or_create(
                program_type=rate["program_type"],
                defaults={
                    "daily_tuition_rate": rate["daily_tuition_rate"],
                    "daily_parent_rate": rate["daily_parent_rate"],
                    "daily_CWELCCA_rate": daily_CWELCCA_rate,
                },
            )

        self.stdout.write(self.style.SUCCESS("Subsidy rates populated successfully!"))
