document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('./components/nav.html');  // Changed from ../components to ./components
        if (!response.ok) {
            throw new Error('Failed to load navigation');
        }
        const navHtml = await response.text();
        document.getElementById('nav-placeholder').innerHTML = navHtml;
    } catch (error) {
        console.error('Error loading navigation:', error);
        document.getElementById('nav-placeholder').innerHTML = 
            '<nav><a href="index.html">Home</a><a href="services.html">Services</a><a href="team.html">Team</a><a href="contact.html">Contact</a></nav>';
    }
});
