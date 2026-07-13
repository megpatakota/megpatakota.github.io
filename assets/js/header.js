// Shared Header Component
// This file centralizes the header/navigation so changes apply everywhere

function getHeader(isArticlePage = false) {
    const basePath = isArticlePage ? '../' : '';
    const indexPath = isArticlePage ? '../index.html' : 'index.html';
    const articlesPath = isArticlePage ? '../main_articles.html' : 'main_articles.html';
    const experiencePath = isArticlePage ? '../experience.html' : 'experience.html';
    const careerPath = isArticlePage ? '../career-support.html' : 'career-support.html';

    return `
    <header id="site-header" class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 transition-transform duration-300">
        <nav class="container mx-auto px-6 py-3">
            <div class="flex justify-between items-center">
                <a href="${indexPath}" class="flex items-center space-x-2.5 hover:opacity-80 transition-opacity group">
                    <div class="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
                        MP
                    </div>
                    <div class="hidden lg:block">
                        <div class="text-sm font-bold text-text_primary">Meghana Patakota</div>
                        <div class="text-xs text-text_tertiary">AI, Automation & Enablement</div>
                    </div>
                </a>

                <!-- Desktop Navigation Menu -->
                <nav class="hidden md:flex items-center gap-4 lg:gap-6">
                    <a href="${careerPath}" class="text-sm text-buttons hover:text-accent transition-colors font-semibold">Career Support</a>
                    <a href="${articlesPath}" class="text-sm text-text_secondary hover:text-buttons transition-colors font-medium">Blog</a>
                    <a href="${experiencePath}" class="text-sm text-text_secondary hover:text-buttons transition-colors font-medium">Experience</a>
                    <details id="desktop-more" class="relative">
                        <summary class="list-none cursor-pointer text-sm text-text_secondary hover:text-buttons transition-colors font-medium inline-flex items-center gap-1.5">
                            More <i class="fas fa-chevron-down text-[10px]" aria-hidden="true"></i>
                        </summary>
                        <div class="absolute right-0 top-full mt-3 w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
                            <a href="${indexPath}#about" class="block rounded-md px-3 py-2 text-sm text-text_secondary hover:bg-bg_light hover:text-buttons">About</a>
                            <a href="${indexPath}#projects" class="block rounded-md px-3 py-2 text-sm text-text_secondary hover:bg-bg_light hover:text-buttons">Projects</a>
                            <a href="${indexPath}#testimonials" class="block rounded-md px-3 py-2 text-sm text-text_secondary hover:bg-bg_light hover:text-buttons">Testimonials</a>
                            <a href="${indexPath}#education" class="block rounded-md px-3 py-2 text-sm text-text_secondary hover:bg-bg_light hover:text-buttons">Education</a>
                        </div>
                    </details>
                    <a href="mailto:megpatakota@icloud.com" class="text-sm px-4 py-2 tech-gradient text-white rounded-lg font-medium hover:shadow-lg hover:shadow-buttons/25 transition-all">
                        <i class="fas fa-envelope mr-1"></i>Contact
                    </a>
                </nav>

                <!-- Hamburger Menu -->
                <button id="mobile-menu-button" class="md:hidden text-text_primary hover:text-buttons transition" type="button" aria-label="Open navigation" aria-controls="mobile-menu" aria-expanded="false">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>

            <!-- Mobile Menu Dropdown -->
            <div id="mobile-menu" class="hidden absolute right-4 top-16 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 py-2 px-1 min-w-[160px] z-50">
                <a href="${careerPath}" class="block px-4 py-2 text-sm text-buttons font-semibold hover:bg-buttons/5 rounded-lg transition">Career Support</a>
                <a href="${articlesPath}" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Blog</a>
                <a href="${experiencePath}" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Experience</a>
                <div class="my-1 border-t border-gray-100"></div>
                <a href="${indexPath}#projects" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Projects</a>
                <a href="${indexPath}#testimonials" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Testimonials</a>
                <a href="${indexPath}#education" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Education</a>
                <a href="${indexPath}#contact" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Contact</a>
            </div>
        </nav>
    </header>
    <!-- Spacing for fixed header -->
    <div class="h-16"></div>
    `;
}

// Auto-inject header
document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('shared-header');
    if (headerPlaceholder) {
        const isArticlePage = headerPlaceholder.dataset.articlePage === 'true';
        headerPlaceholder.outerHTML = getHeader(isArticlePage);

        // Re-initialize mobile menu toggle after injection
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                mobileMenuButton.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
        }

        const desktopMore = document.getElementById('desktop-more');
        if (desktopMore) {
            desktopMore.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => desktopMore.removeAttribute('open'));
            });
            document.addEventListener('click', function(event) {
                if (!desktopMore.contains(event.target)) desktopMore.removeAttribute('open');
            });
        }

        // Hide header on scroll down, show on scroll up
        const header = document.getElementById('site-header');
        if (header) {
            let lastY = 0;
            let ticking = false;
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        const y = window.scrollY;
                        if (y > 80 && y > lastY) {
                            header.style.transform = 'translateY(-100%)';
                        } else {
                            header.style.transform = 'translateY(0)';
                        }
                        lastY = y;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
    }
});
