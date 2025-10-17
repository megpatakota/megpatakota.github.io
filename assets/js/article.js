/**
 * Article Page JavaScript
 * Handles mobile menu for article pages and view tracking
 */

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// View Tracking System
class ViewTracker {
    constructor() {
        this.storageKey = 'megpatakota_page_views';
        this.sessionKey = 'megpatakota_session_id';
        this.currentPage = this.getCurrentPageSlug();
        this.sessionId = this.getOrCreateSessionId();
        this.init();
    }

    getCurrentPageSlug() {
        const path = window.location.pathname;
        
        // Extract page identifier from path
        if (path === '/' || path === '/index.html') {
            return 'home';
        } else if (path.includes('/articles/')) {
            const match = path.match(/\/articles\/([^\/]+)\.html$/);
            return match ? `article_${match[1]}` : null;
        } else if (path === '/admin.html' || path.includes('/admin.html')) {
            return 'admin';
        } else {
            // For other pages, use the filename without extension
            const match = path.match(/\/([^\/]+)\.html$/);
            return match ? match[1] : path.replace(/\//g, '_').replace(/\.html$/, '') || 'unknown';
        }
    }

    getOrCreateSessionId() {
        try {
            let sessionId = localStorage.getItem(this.sessionKey);
            if (!sessionId) {
                // Create a unique session ID using timestamp + random string
                sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
                localStorage.setItem(this.sessionKey, sessionId);
            }
            return sessionId;
        } catch (error) {
            // Fallback to sessionStorage if localStorage fails
            let sessionId = sessionStorage.getItem(this.sessionKey);
            if (!sessionId) {
                sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
                sessionStorage.setItem(this.sessionKey, sessionId);
            }
            return sessionId;
        }
    }

    init() {
        if (!this.currentPage) return;
        
        this.trackView();
        this.displayViewCount();
    }

    trackView() {
        try {
            // Send view data to server
            this.sendViewToServer();
            
            // Also keep local tracking for immediate display
            const views = this.getViews();
            const viewKey = `viewed_${this.currentPage}`;
            
            // Initialize page data if it doesn't exist
            if (!views[viewKey]) {
                views[viewKey] = {
                    firstView: new Date().toISOString(),
                    totalViews: 0,
                    uniqueUsers: new Set(),
                    lastView: new Date().toISOString(),
                    pageType: this.getPageType()
                };
            }
            
            // Always increment total views
            views[viewKey].totalViews++;
            views[viewKey].lastView = new Date().toISOString();
            
            // Add current session to unique users
            views[viewKey].uniqueUsers.add(this.sessionId);
            
            // Convert Set to Array for storage (localStorage can't store Sets)
            const viewsForStorage = {
                ...views,
                [viewKey]: {
                    ...views[viewKey],
                    uniqueUsers: Array.from(views[viewKey].uniqueUsers)
                }
            };
            
            this.saveViews(viewsForStorage);
        } catch (error) {
            console.warn('View tracking failed:', error);
        }
    }

    async sendViewToServer() {
        try {
            const response = await fetch('/api/track-view', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: this.currentPage,
                    sessionId: this.sessionId,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                console.warn('Failed to send view to server:', response.status);
            }
        } catch (error) {
            console.warn('Error sending view to server:', error);
        }
    }

    getPageType() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('/articles/')) return 'article';
        if (path === '/admin.html' || path.includes('/admin.html')) return 'admin';
        return 'page';
    }

    getViews() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return {};
            
            const parsed = JSON.parse(stored);
            
            // Convert uniqueUsers arrays back to Sets
            Object.keys(parsed).forEach(key => {
                if (parsed[key].uniqueUsers && Array.isArray(parsed[key].uniqueUsers)) {
                    parsed[key].uniqueUsers = new Set(parsed[key].uniqueUsers);
                }
            });
            
            return parsed;
        } catch (error) {
            console.warn('Failed to read view data:', error);
            return {};
        }
    }

    saveViews(views) {
        try {
            // Convert Sets to Arrays for storage
            const viewsForStorage = {};
            Object.keys(views).forEach(key => {
                viewsForStorage[key] = {
                    ...views[key],
                    uniqueUsers: Array.from(views[key].uniqueUsers || [])
                };
            });
            
            localStorage.setItem(this.storageKey, JSON.stringify(viewsForStorage));
        } catch (error) {
            console.warn('Failed to save view data:', error);
        }
    }

    getPageStats() {
        const views = this.getViews();
        const viewKey = `viewed_${this.currentPage}`;
        
        if (!views[viewKey]) {
            return { totalViews: 0, uniqueUsers: 0 };
        }
        
        return {
            totalViews: views[viewKey].totalViews || 0,
            uniqueUsers: views[viewKey].uniqueUsers ? views[viewKey].uniqueUsers.size : 0
        };
    }

    getAllPagesStats() {
        const views = this.getViews();
        let totalViews = 0;
        let totalUniqueUsers = new Set();
        
        Object.values(views).forEach(page => {
            totalViews += page.totalViews || 0;
            if (page.uniqueUsers) {
                page.uniqueUsers.forEach(user => totalUniqueUsers.add(user));
            }
        });
        
        return {
            totalViews,
            totalUniqueUsers: totalUniqueUsers.size
        };
    }

    displayViewCount() {
        const viewCountElement = document.getElementById('view-count');
        const uniqueUsersElement = document.getElementById('unique-users');
        
        // Only show counters on article pages (not on admin or other pages)
        if (!viewCountElement || this.getPageType() !== 'article') return;

        const stats = this.getPageStats();
        
        // Update the display
        viewCountElement.textContent = stats.totalViews;
        
        // Update unique users if element exists
        if (uniqueUsersElement) {
            uniqueUsersElement.textContent = stats.uniqueUsers;
        }
        
        // Add a subtle animation
        viewCountElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            viewCountElement.style.transform = 'scale(1)';
        }, 200);
        
        // Log analytics data
        const allStats = this.getAllPagesStats();
        console.log(`Page: ${this.currentPage}`, {
            totalViews: stats.totalViews,
            uniqueUsers: stats.uniqueUsers,
            sessionId: this.sessionId,
            allPages: allStats
        });
    }
}

// Initialize view tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ViewTracker();
});
