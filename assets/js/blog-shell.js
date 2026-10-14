// Homepage navigation and footer for the blog, including nested series pages.
(() => {
    const scriptUrl = document.currentScript.src;
    const root = new URL('../../', scriptUrl);
    const page = (path) => new URL(path, root).href;
    document.addEventListener('DOMContentLoaded', () => {
        const header = document.getElementById('shared-header');
        if (header) {
            header.outerHTML = `
                <header class="site-header">
                    <a class="brand" href="${page('index.html')}" aria-label="Meg Patakota, home">
                        <span class="brand-mark" aria-hidden="true">MP</span>
                        <span class="brand-divider" aria-hidden="true"></span>
                        <span class="brand-copy">
                            <span class="brand-name">Meg Patakota</span>
                            <span class="brand-role">AI, Automation &amp; Enablement</span>
                        </span>
                    </a>
                    <nav class="main-nav" aria-label="Main navigation">
                        <a class="nav-link career-link" href="${page('career-support.html')}">Career support</a>
                        <a class="nav-link blog-link" href="${page('main_articles.html')}" ${document.body.classList.contains('blog-index') ? 'aria-current="page"' : ''}>Blog</a>
                        <a class="nav-link contact-link" href="${page('index.html#contact')}">Contact</a>
                        <details class="nav-menu" id="blog-menu">
                            <summary>Explore <span class="menu-caret" aria-hidden="true">&#8964;</span></summary>
                            <div class="menu-panel">
                                <a href="${page('index.html#about')}">About</a>
                                <a href="${page('index.html#focus')}">Focus</a>
                                <a href="${page('index.html#work')}">Selected work</a>
                                <a href="${page('index.html#testimonials')}">Testimonials</a>
                                <a href="${page('experience.html')}">Full experience</a>
                                <a href="${page('main_articles.html')}">Blog</a>
                                <a href="https://www.tremoli.com" target="_blank" rel="noopener noreferrer">Tremoli</a>
                            </div>
                        </details>
                    </nav>
                </header>`;
        }
        const footer = document.getElementById('shared-footer');
        if (footer) {
            footer.outerHTML = `
                <footer class="site-footer">
                    <span>&copy; ${new Date().getFullYear()} Meg Patakota</span>
                    <nav class="footer-links" aria-label="Footer navigation">
                        <a href="${page('career-support.html')}">Career support</a>
                        <a href="${page('main_articles.html')}">Blog</a>
                        <a href="${page('experience.html')}">Experience</a>
                        <a href="https://www.tremoli.com" target="_blank" rel="noopener noreferrer">Tremoli</a>
                        <a href="mailto:megpatakota@icloud.com">Email</a>
                    </nav>
                </footer>`;
        }
        const menu = document.getElementById('blog-menu');
        if (menu) {
            document.addEventListener('click', (event) => {
                if (!menu.contains(event.target)) menu.open = false;
            });
            menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && menu.open) {
                    menu.open = false;
                    menu.querySelector('summary').focus();
                }
            });
        }
    });
})();
