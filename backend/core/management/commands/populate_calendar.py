from django.core.management.base import BaseCommand
from core.models import Calendar
from datetime import date, timedelta

class Command(BaseCommand):
    help = "Populate the Calendar Table with dates for the year."

    def handle(self, *args, **kwargs):
        start_date = date(2025, 1, 1)  # Start date
        end_date = date(2025, 12, 31)  # End date
        delta = timedelta(days=1)

        while start_date <= end_date:
            is_weekday = start_date.weekday() < 5  # Mon-Fri
            Calendar.objects.get_or_create(
                date=start_date,
                defaults={
                    "is_weekday": is_weekday,
                    "is_stat_holiday": False,  # Update for holidays later
                    "is_closed": not is_weekday,  # Closed on weekends
                },
            )
            start_date += delta

        self.stdout.write(self.style.SUCCESS("Calendar table populated successfully!"))
