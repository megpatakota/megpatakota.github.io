/**
 * Main JavaScript for Meg Patakota Portfolio
 * Handles navigation, forms, and interactions
 */

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

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

// Contact Form - AJAX submission with notification
const contactForm = document.getElementById('contactForm');
const successToast = document.getElementById('successToast');
const errorToast = document.getElementById('errorToast');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
        
        // Submit form via AJAX
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Show success notification
            showToast(successToast);
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        })
        .catch(error => {
            // Show error notification
            showToast(errorToast);
            
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
}

// Function to show and auto-hide toast notifications
function showToast(toastElement) {
    toastElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toastElement.classList.add('hidden');
    }, 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Read more functionality for testimonials – open LinkedIn recommendations
const LINKEDIN_RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/megpatakota/details/recommendations/?detailScreenTabIndex=0';

document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        window.open(LINKEDIN_RECOMMENDATIONS_URL, '_blank', 'noopener');
    });
});


