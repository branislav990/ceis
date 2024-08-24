from django.contrib import admin
from .models import Literature, Publisher, ResearchSubject, Journal, ScientificConference, Author


admin.site.register(Literature, admin.ModelAdmin)
admin.site.register(Publisher, admin.ModelAdmin)
admin.site.register(ResearchSubject, admin.ModelAdmin)
admin.site.register(Journal, admin.ModelAdmin)
admin.site.register(ScientificConference, admin.ModelAdmin)
admin.site.register(Author, admin.ModelAdmin)
