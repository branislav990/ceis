from django import forms
from .models import Comment
from django.utils.html import escape


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['name', 'email', 'content']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Vaše ime'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'Vaša e-mail adresa'
            }),
            'content': forms.Textarea(attrs={
                'placeholder': 'Vaš komentar...'
            }),
        }
        labels = {
            'name': None,
            'email': None,
            'content': None,
        }

    checkbox = forms.CheckboxInput(attrs={})

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        if self.user is not None and self.user.is_authenticated:
            self.fields['name'].required = False
            self.fields['email'].required = False

        for field_name, field_value in self.fields.items():
            if field_name == 'name':
                field_value.error_messages['required'] = 'Polje Ime je obavezno.'
            elif field_name == 'email':
                field_value.error_messages['required'] = 'Polje Email je obavezno.'
                field_value.error_messages['invalid'] = 'Unesite ispravnu email adresu.'
            elif field_name == 'content':
                field_value.error_messages['required'] = 'Polje Vaš komentar je obavezno.'

    def clean(self):
        cleaned_data = super().clean()
        for field in ['name', 'email', 'content']:
            if field in cleaned_data:
                cleaned_data[field] = escape(cleaned_data[field])
        return cleaned_data
