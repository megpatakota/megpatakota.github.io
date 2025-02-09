/**
 * animations.js
 *
 * This script handles various interactive and animated features of the website, including:
 * - Animated background with moving data elements in the hero section
 * - Interactive skill and project cards with hover and click effects
 * - Header scroll behavior to show/hide based on scroll position
 * - Call-to-action (CTA) button interactivity
 * - Dropdown menu functionality
 * - Project scroll behavior with left/right buttons and keyboard navigation
 */

// Animated Background with Data Elements
function createAnimatedBackground() {
    const canvas = document.getElementById('hero-canvas');
    const heroSection = document.getElementById('hero');

    // Check if the necessary elements exist
    if (!canvas || !heroSection) return;

    const ctx = canvas.getContext('2d');

    // Resize the canvas to match the hero section size
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const dataElements = [];
    const numberOfElements = 50;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let maxRadius = Math.min(canvas.width, canvas.height); // Maximum radius for elements
    let minRadius = maxRadius / 4; // Minimum radius for elements

    let mouseX = 1000;
    let mouseY = 1000;

    // Class representing each data element in the animation
    class DataElement {
        constructor() {
            this.angle = Math.random() * Math.PI * 2; // Random starting angle
            this.radius = Math.random() * (maxRadius - minRadius) + minRadius; // Random radius within bounds
            this.size = Math.random() * 12 + 6; // Random size between 6 and 18
            this.speed = 0.001 + Math.random() * 0.0005; // Speed of rotation
            this.type = Math.floor(Math.random() * 3); // Type of element (number or symbol)
            this.color = `#001230${Math.floor((Math.random() * 0.3 + 0.1) * 255).toString(16)}`; // Random semi-transparent blue color
            this.value = Math.floor(Math.random() * 100); // Random number value
            this.direction = Math.random() < 0.1 ? 1 : -1; // Random direction (mostly counter-clockwise)
            this.symbol = this.getRandomSymbol(); // Assign a random symbol
        }

        update() {
            this.angle += this.speed * this.direction; // Update angle based on speed and direction

            // Update position based on angle and radius
            this.x = centerX + Math.cos(this.angle) * this.radius;
            this.y = centerY + Math.sin(this.angle) * this.radius;

            // Slight radial oscillation to create a wobbling effect
            this.radius += Math.sin(this.angle * 5) * 0.1;
            // Ensure radius stays within bounds
            if (this.radius < minRadius) this.radius = minRadius;
            if (this.radius > maxRadius) this.radius = maxRadius;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            if (this.type === 0) {
                // Draw number value
                ctx.fillText(this.value, this.x, this.y);
            } else {
                // Draw symbol
                ctx.fillText(this.symbol, this.x, this.y);
            }

            // Reset shadow (if any)
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        getRandomSymbol() {
            const symbols = ['Σ', 'μ', 'σ', 'Δ', '∫', '∞', 'θ', 'λ', '√', 'π'];
            return symbols[Math.floor(Math.random() * symbols.length)];
        }
    }

    // Initialize data elements
    function init() {
        dataElements.length = 0;
        for (let i = 0; i < numberOfElements; i++) {
            dataElements.push(new DataElement());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < dataElements.length; i++) {
            dataElements[i].update();
            dataElements[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    // Re-initialize on window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        // Update center positions and radii when resizing
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        maxRadius = Math.min(canvas.width, canvas.height);
        minRadius = maxRadius / 4;
        init();
    });

    // Update mouse position (currently not used but available for future interactivity)
    heroSection.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    });
}

// Interactive Skills and Projects Cards
function createInteractiveElements() {
    const skillCards = document.querySelectorAll('.skill-card');
    const projectCards = document.querySelectorAll('.project-card');

    // Add interactivity to each card (hover and click effects)
    function addInteractivity(cards) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) translateY(-10px)';
                card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) translateY(0)';
                card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            });

            card.addEventListener('click', () => {
                card.classList.add('clicked');
                setTimeout(() => {
                    card.classList.remove('clicked');
                }, 300);
            });
        });
    }

    addInteractivity(skillCards);
    addInteractivity(projectCards);
}

// Header Scroll Behavior with Threshold
function createHeaderScrollBehavior() {
    const header = document.querySelector('header');

    // Check if the header exists
    if (!header) return;

    const scrollThreshold = 100; // Adjust this value to set when the header should disappear

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > scrollThreshold) {
            // Past the threshold, hide the header
            header.classList.add('header-hidden');
        } else {
            // Above the threshold, show the header
            header.classList.remove('header-hidden');
        }
    }, false);
}

// Add Interactivity to CTA Buttons
function createCTAButtonInteractivity() {
    const exploreButton = document.getElementById('explore-button');
    const collaborateButton = document.getElementById('collaborate-button');

    function addButtonEffect(button) {
        if (!button) return; // Ensure the button exists
        button.addEventListener('click', () => {
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 300);
        });
    }

    addButtonEffect(exploreButton);
    addButtonEffect(collaborateButton);
}

// Dropdown Menu Behavior
function createDropdownMenu() {
    const dropBtn = document.getElementById('dropbtn');
    const dropdownContent = document.getElementById('myDropdown');

    // Check if the dropdown elements exist
    if (!dropBtn || !dropdownContent) return;

    // Toggle dropdown visibility on button click
    dropBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Stop the event from bubbling up
        dropdownContent.classList.toggle('show');
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!dropBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
}

// Initialize Project Scroll Behavior (formerly left.js)
function initializeProjectScroll() {
    const container = document.getElementById('projectsContainer');
    const leftButton = document.getElementById('scrollLeft');
    const rightButton = document.getElementById('scrollRight');
    const scrollAmount = 400; // Adjust this value to control scroll distance

    if (!container || !leftButton || !rightButton) {
        console.warn('Scroll elements not found.');
        return; // Ensure elements exist before continuing
    }

    // Scroll buttons click handlers with circular scrolling
    leftButton.addEventListener('click', () => {
        if (container.scrollLeft <= 0) {
            // At the beginning, scroll to the end
            container.scrollTo({
                left: container.scrollWidth - container.clientWidth,
                behavior: 'smooth'
            });
        } else {
            // Scroll left by scrollAmount
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    });

    rightButton.addEventListener('click', () => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft) {
            // At the end, scroll back to the beginning
            container.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            // Scroll right by scrollAmount
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    });

}
// Attach initializeProjectScroll to the global window object
window.initializeProjectScroll = initializeProjectScroll;

// Initialize Everything When DOM is Ready
document.addEventListener('DOMContentLoaded', () => {
    // Only call functions if their necessary elements exist
    createAnimatedBackground();
    createInteractiveElements();
    createHeaderScrollBehavior();
    createCTAButtonInteractivity();
    createDropdownMenu();
    // initializeProjectScroll(); // Ensure this is called after other functions
});
