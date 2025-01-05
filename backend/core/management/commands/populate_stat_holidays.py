from django.core.management.base import BaseCommand
from core.models import Calendar
from datetime import date, timedelta

# Function to calculate specific holidays
def third_monday_of_february(year):
    february_first = date(year, 2, 1)
    return february_first + timedelta(days=(7 - february_first.weekday()) % 7 + 14)

def friday_before_easter(year):
    # Computus algorithm to calculate Easter Sunday
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1

    # Easter Sunday
    easter = date(year, month, day)

    # Good Friday is two days before Easter Sunday
    return easter - timedelta(days=2)

def last_monday_before_may_25(year):
    may_25 = date(year, 5, 25)
    return may_25 - timedelta(days=(may_25.weekday() + 1))

def first_monday_of_september(year):
    september_first = date(year, 9, 1)
    return september_first + timedelta(days=(7 - september_first.weekday()) % 7)

def second_monday_of_october(year):
    october_first = date(year, 10, 1)
    first_monday = october_first + timedelta(days=(7 - october_first.weekday()) % 7)
    return first_monday + timedelta(days=7)

class Command(BaseCommand):
    help = "Populate calendar with stat holidays and substitutions"

    def handle(self, *args, **kwargs):
        STAT_HOLIDAYS = {
            "New Year's Day": {"date": "2025-01-01"},
            "Family Day": {"date": None, "calculation": third_monday_of_february},
            "Good Friday": {"date": None, "calculation": friday_before_easter},
            "Victoria Day": {"date": None, "calculation": last_monday_before_may_25},
            "Canada Day": {"date": "2025-07-01"},
            "Civic Holiday": {"date": None, "calculation": first_monday_of_september},
            "Labour Day": {"date": None, "calculation": first_monday_of_september},
            "Thanksgiving Day": {"date": None, "calculation": second_monday_of_october},
            "Christmas Day": {"date": "2025-12-25"},
            "Boxing Day": {"date": "2025-12-26"},
        }

        year = date.today().year

        for holiday_name, details in STAT_HOLIDAYS.items():
            if details["date"]:
                holiday_date = date.fromisoformat(details["date"])
            else:
                holiday_date = details["calculation"](year)

            is_weekend = holiday_date.weekday() in [5, 6]  # Saturday or Sunday

            # Determine substitution date
            substitution_date = holiday_date
            if is_weekend:
                if holiday_date.weekday() == 5:  # Saturday
                    substitution_date = holiday_date + timedelta(days=2)
                elif holiday_date.weekday() == 6:  # Sunday
                    substitution_date = holiday_date + timedelta(days=1)

            # Add holiday to the calendar
            Calendar.objects.update_or_create(
                date=holiday_date,
                defaults={
                    "is_stat_holiday": True,
                    "is_closed": True,
                    "stat_substitution_date": substitution_date if is_weekend else None,
                },
            )

            # Add substitution day to the calendar (if applicable)
            if is_weekend:
                Calendar.objects.update_or_create(
                    date=substitution_date,
                    defaults={
                        "is_stat_holiday": True,
                        "is_closed": True,
                    },
                )

        self.stdout.write(self.style.SUCCESS("Stat holidays populated successfully."))
