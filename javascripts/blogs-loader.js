// blogs-loader.js

/**
 * This script dynamically loads Medium blog posts and displays them in a horizontally scrollable section
 * with left and right scroll buttons. Circular scrolling is implemented, so when the user reaches the end
 * and clicks the right arrow, it wraps around to the beginning, and vice versa.
 * 
 * Major updates include:
 * - Implementing circular scroll functionality with left and right buttons.
 * - Creating the necessary DOM structure for horizontal scrolling within the script.
 * - Injecting necessary CSS styles directly from the script to minimize changes in main.html.
 */

// Function to inject necessary styles for the blogs section
function injectBlogsStyles() {
    const styles = `
    /* Styles for the blogs horizontal scroll */
    .scroll-container {
        position: relative;
        width: 100%;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .blogs-wrapper {
        position: relative;
        overflow: hidden;
        padding: 1rem 0;
    }

    .blogs-scroll {
        display: flex;
        gap: 2rem;
        overflow-x: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding: 1rem 0;
    }

    .blogs-scroll::-webkit-scrollbar {
        display: none;
    }

    .blog-card {
        flex: 0 0 auto;
        width: 450px; /* Adjust the width as needed */
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }

    .blog-card:hover {
        transform: translateY(-0.5rem) scale(1.05);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    }

    .scroll-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        border: none;
        outline: none;
    }

    .scroll-button.left {
        left: 0;
    }

    .scroll-button.right {
        right: 0;
    }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// Function to fetch Medium articles and display them in a horizontal scroll with left/right buttons
document.addEventListener('DOMContentLoaded', async () => {
    // Inject styles
    injectBlogsStyles();

    const blogContainer = document.getElementById('blogs-container');
    const articles = await fetchMediumArticles('megpatakota'); // Replace with your Medium username

    if (articles.length) {
        // Create the necessary DOM structure for horizontal scrolling
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';

        const blogsWrapper = document.createElement('div');
        blogsWrapper.className = 'blogs-wrapper';

        // Scroll buttons
        const leftButton = document.createElement('button');
        leftButton.className = 'scroll-button left';
        leftButton.id = 'blogsScrollLeft';
        leftButton.setAttribute('aria-label', 'Scroll left');
        leftButton.innerHTML = '<i class="fas fa-chevron-left"></i>';

        const rightButton = document.createElement('button');
        rightButton.className = 'scroll-button right';
        rightButton.id = 'blogsScrollRight';
        rightButton.setAttribute('aria-label', 'Scroll right');
        rightButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

        // Blogs scroll container
        const blogsScroll = document.createElement('div');
        blogsScroll.className = 'blogs-scroll';
        blogsScroll.id = 'blogsScrollContainer';

        // Append article cards to blogsScroll
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'blog-card';

            articleCard.innerHTML = `
                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-contain">
                <div class="p-6">
                    <h3 class="text-xl font-normal mb-2 text-primary">${article.title}</h3>
                    <p class="text-gray-600 mb-4">${article.description}</p>
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" 
                       class="text-secondary hover:text-secondary font-semibold transition duration-300">
                       Read More →
                    </a>
                </div>
            `;

            blogsScroll.appendChild(articleCard);
        });

        // Append elements accordingly
        blogsWrapper.appendChild(leftButton);
        blogsWrapper.appendChild(rightButton);
        blogsWrapper.appendChild(blogsScroll);

        scrollContainer.appendChild(blogsWrapper);

        blogContainer.appendChild(scrollContainer);

        // Now implement the scroll functionality
        initializeBlogsScroll();
    } else {
        blogContainer.innerHTML = '<p class="text-center text-gray-500">No articles available at the moment.</p>';
    }
});

/**
 * Function to fetch articles from Medium RSS feed.
 * @param {string} username - Medium username.
 * @returns {Promise<Array>} - Array of article objects.
 */
async function fetchMediumArticles(username) {
    const rss2jsonURL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
    try {
        const response = await fetch(rss2jsonURL);
        const data = await response.json();

        const articles = data.items.map(item => {
            // Extract the first image URL from the description
            const imgRegex = /<img.*?src="(.*?)"/;
            const imageMatch = imgRegex.exec(item.description);
            const imageUrl = imageMatch ? imageMatch[1] : 'https://via.placeholder.com/150';  // Placeholder if no image found
            
            return {
                title: item.title,
                description: item.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...',
                image: imageUrl,
                link: item.link,
            };
        });

        return articles;
    } catch (error) {
        console.error('Error fetching Medium articles:', error);
        return [];
    }
}

/**
 * Function to initialize the scroll behavior for the blogs section.
 * It adds event listeners to the scroll buttons and implements circular scrolling.
 */
function initializeBlogsScroll() {
    const container = document.getElementById('blogsScrollContainer');
    const leftButton = document.getElementById('blogsScrollLeft');
    const rightButton = document.getElementById('blogsScrollRight');
    const scrollAmount = 400; // Adjust this value to control scroll distance

    if (!container || !leftButton || !rightButton) {
        console.warn('Blogs scroll elements not found.');
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
    // Update button states on scroll
    container.addEventListener('scroll', updateScrollButtons);

    // Update button states on window resize
    window.addEventListener('resize', updateScrollButtons);
}
