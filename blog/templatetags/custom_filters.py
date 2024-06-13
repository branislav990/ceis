from django import template
from django.utils.timezone import now as django_now
from datetime import datetime, timedelta

register = template.Library()

@register.filter
def custom_naturaltime(value):
    """
    Returns a natural representation of a time delta, e.g., '3 days ago', '2 months ago', etc.,
    with custom translations for Serbian Latin.
    """
    if not value:
        return ''

    if isinstance(value, datetime):
        delta = django_now() - value
    elif isinstance(value, timedelta):
        delta = value
    else:
        return value

    # Custom translations
    time_strings = {
        'year': ('godina', 'godine', 'godina'),
        'month': ('mesec', 'meseca', 'meseci'),
        'week': ('nedelja', 'nedelje', 'nedelja'),
        'day': ('dan', 'dana', 'dana'),
        'hour': ('sat', 'sata', 'sati'),
        'minute': ('minut', 'minuta', 'minuta'),
        'second': ('sekund', 'sekunde', 'sekundi'),
    }

    def format_string(number, unit):
        if number % 10 == 1 and (number % 100 != 11):
            return f'{number} {time_strings[unit][0]}'
        elif 2 <= number % 10 <= 4 and not (12 <= number % 100 <= 14):
            return f'{number} {time_strings[unit][1]}'
        else:
            return f'{number} {time_strings[unit][2]}'

    if delta.days >= 365:
        years = delta.days // 365
        return format_string(years, 'year')
    elif delta.days >= 30:
        months = delta.days // 30
        return format_string(months, 'month')
    elif delta.days >= 7:
        weeks = delta.days // 7
        return format_string(weeks, 'week')
    elif delta.days >= 1:
        return format_string(delta.days, 'day')
    elif delta.seconds >= 3600:
        hours = delta.seconds // 3600
        return format_string(hours, 'hour')
    elif delta.seconds >= 60:
        minutes = delta.seconds // 60
        return format_string(minutes, 'minute')
    else:
        return format_string(delta.seconds, 'second')


@register.filter(name='replace')
def replace(value, args):
    """Replaces all occurrences of the first character with the second character in a string."""
    old_char, new_char = args.split(',')
    return value.replace(old_char, new_char)