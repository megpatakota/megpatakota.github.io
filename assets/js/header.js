// Shared Header Component
// This file centralizes the header/navigation so changes apply everywhere

function getHeader(isArticlePage = false) {
    const basePath = isArticlePage ? '../' : '';
    const indexPath = isArticlePage ? '../index.html' : 'index.html';
    const articlesPath = isArticlePage ? '../main_articles.html' : 'main_articles.html';
    const experiencePath = isArticlePage ? '../experience.html' : 'experience.html';

    return `
    <header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <nav class="container mx-auto px-6 py-3">
            <div class="flex justify-between items-center">
                <a href="${indexPath}" class="flex items-center space-x-2.5 hover:opacity-80 transition-opacity group">
                    <div class="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
                        MP
                    </div>
                    <div class="hidden sm:block">
                        <div class="text-sm font-bold text-text_primary">Meghana Patakota</div>
                        <div class="text-xs text-text_tertiary">Data & AI Solutions</div>
                    </div>
                </a>

                <!-- Desktop Navigation Menu -->
                <nav class="hidden md:flex items-center gap-8">
                    <a href="${articlesPath}" class="text-sm text-text_secondary hover:text-buttons transition-colors font-medium">Blogs</a>
                    <a href="${experiencePath}" class="text-sm text-text_secondary hover:text-buttons transition-colors font-medium">Experience</a>
                    <a href="${indexPath}#projects" class="text-sm text-text_secondary hover:text-buttons transition-colors font-medium">Projects</a>
                    <a href="${indexPath}#testimonials" class="text-sm text-text_secondary hover:text-buttons transition-colors font-medium">Testimonials</a>
                    <a href="mailto:megpatakota@icloud.com" class="text-sm px-4 py-2 tech-gradient text-white rounded-lg font-medium hover:shadow-lg hover:shadow-buttons/25 transition-all">
                        <i class="fas fa-envelope mr-1"></i>Contact
                    </a>
                </nav>

                <!-- Hamburger Menu -->
                <button id="mobile-menu-button" class="md:hidden text-text_primary hover:text-buttons transition">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>

            <!-- Mobile Menu Dropdown -->
            <div id="mobile-menu" class="hidden absolute right-4 top-16 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 py-2 px-1 min-w-[160px] z-50">
                <a href="${articlesPath}" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Blogs</a>
                <a href="${indexPath}#contact" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Contact</a>
                <a href="${indexPath}#education" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Education</a>
                <a href="${experiencePath}" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Experience</a>
                <a href="${indexPath}#projects" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Projects</a>
                <a href="${indexPath}#testimonials" class="block px-4 py-2 text-sm text-text_secondary hover:text-buttons hover:bg-buttons/5 rounded-lg transition">Testimonials</a>
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
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }
});
