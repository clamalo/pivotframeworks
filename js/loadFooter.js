document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('./components/footer.html');
        if (!response.ok) {
            throw new Error('Failed to load footer');
        }
        const footerHtml = await response.text();
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
    } catch (error) {
        console.error('Error loading footer:', error);
        document.getElementById('footer-placeholder').innerHTML = 
            '<footer><p>&copy; 2025 Pivot Frameworks. All rights reserved.</p></footer>';
    }
});
