// content-loader.js

document.addEventListener('DOMContentLoaded', function () {
    loadContent('technical-skills.html', 'technical-skills-container');
    loadContent('projects.html', 'projects-container', initializeProjectScroll);
    loadContent('collab.html', 'collab-container', initializeProjectScroll);
    loadContent('io/about-me.html', 'about-container');  // Fixed path and container ID
    loadContent('articles.html', 'articles-container');
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
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = data;
                // Call the callback function if provided
                if (callback && typeof callback === 'function') {
                    callback();
                }
            } else {
                console.error(`Container with ID '${containerId}' not found.`);
            }
        })
        .catch(error => {
            console.error(`Error loading ${file}:`, error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<p style="color:red;">Failed to load ${file} section.</p>`;
            }
        });
}
