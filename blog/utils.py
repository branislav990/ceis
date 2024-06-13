import re
from django.utils.html import format_html


def transform_oembed(content):
    oembed_pattern = re.compile(r'<oembed url="(.+?)"></oembed>')

    def replace_oembed(match):
        url = match.group(1)
        embed_url = url.replace('watch?v=', 'embed/')
        iframe = format_html(
            '<iframe src="{}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
            embed_url
        )
        return iframe
    return oembed_pattern.sub(replace_oembed, content)
