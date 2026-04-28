// Shared Footer Component
// Injects a consistent footer into pages that include #shared-footer.

function getFooter(isArticlePage = true) {
    const basePath = isArticlePage ? '../' : '';
    const indexPath = `${basePath}index.html`;
    const experiencePath = `${basePath}experience.html`;

    return `
    <footer class="bg-text_primary text-white py-10 px-6 mt-12">
        <div class="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">MP</div>
                <div>
                    <p class="font-semibold">Meg Patakota</p>
                    <p class="text-sm text-white/60">Data &bull; AI &bull; Analytics</p>
                </div>
            </div>
            <div class="flex items-center gap-3 text-sm text-white/70">
                <a href="${experiencePath}" class="hover:text-white transition">Experience</a>
                <span class="hidden sm:inline">&bull;</span>
                <a href="${indexPath}#projects" class="hover:text-white transition">Projects</a>
                <span class="hidden sm:inline">&bull;</span>
                <a href="https://www.linkedin.com/in/megpatakota/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition">Contact</a>
                <span class="hidden sm:inline">&bull;</span>
                <a href="https://www.tremoli.com" target="_blank" rel="noopener noreferrer" class="tremoli-shimmer transition">Tremoli</a>
            </div>
        </div>
    </footer>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('shared-footer');
    if (footerPlaceholder) {
        const isArticlePage = footerPlaceholder.dataset.articlePage !== 'false';
        footerPlaceholder.outerHTML = getFooter(isArticlePage);
    }
});
