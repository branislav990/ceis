const blogContent = document.getElementById('blog-post-content');
const blogLinks = blogContent.getElementsByTagName('a');
for (let link of blogLinks) {
    link.setAttribute('target', '_blank');
}