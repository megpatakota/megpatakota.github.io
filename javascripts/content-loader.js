// content-loader.js

document.addEventListener('DOMContentLoaded', function () {
    loadContent('technical-skills.html', 'technical-skills-container');
    loadContent('projects.html', 'projects-container', initializeProjectScroll);
    loadContent('collab.html', 'collab-container', initializeProjectScroll);
});

function loadContent(file, containerId, callback) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            // Call the callback function if provided
            if (callback && typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error(`Error loading ${file}:`, error);
            document.getElementById(containerId).innerHTML =
                `<p style="color:red;">Failed to load ${file} section.</p>`;
        });
}
