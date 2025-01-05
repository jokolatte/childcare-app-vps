from core.models import SubsidyRate

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Populate subsidy rates for each program type"

    def handle(self, *args, **kwargs):
        subsidy_rates = [
            {"program_type": "Infant", "daily_tuition_rate": 110.19, "parent_daily_cap": 22},
            {"program_type": "Toddler", "daily_tuition_rate": 92.31, "parent_daily_cap": 22},
            {"program_type": "Preschool", "daily_tuition_rate": 74.36, "parent_daily_cap": 22},
        ]

        for rate in subsidy_rates:
            government_daily_subsidy = rate["daily_tuition_rate"] - rate["parent_daily_cap"]
            SubsidyRate.objects.update_or_create(
                program_type=rate["program_type"],
                defaults={
                    "daily_tuition_rate": rate["daily_tuition_rate"],
                    "parent_daily_cap": rate["parent_daily_cap"],
                    "government_daily_subsidy": government_daily_subsidy,
                },
            )

        self.stdout.write(self.style.SUCCESS("Subsidy rates populated successfully!"))
