// linkedin-autoscroll.js

/**
 * This script creates a horizontal auto-scrolling "LinkedIn posts" section
 * that continuously rolls from left to right. It automatically duplicates
 * smaller arrays (fewer than 4 items) and ensures:
 * - Each image is fully visible (object-fit: contain).
 * - Text begins at the same height for all cards (fixed-height container).
 */

// 1. Inject CSS for the carousel and fixed-height image container
function injectLinkedInStyles() {
  const styles = `
      /* Overall carousel container */
      .scroll-container {
        position: relative;
        width: 100%;
        margin: 1rem auto;
        max-width: 1900px; /* Adjust as needed */
      }
  
      /* Wrapper around the scrollable area */
      .linkedin-wrapper {
        position: relative;
        overflow: hidden;
        border: 1px solid #e2cfea;
        border-radius: 6px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 1rem;
      }
  
      /* The actual scrolling container */
      .linkedin-scroll {
        display: flex;
        gap: 1rem;
        overflow: hidden; /* We'll move this via JavaScript for the rolling effect */
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
  
      /* LinkedIn post "card" */
      .linkedin-card {
        flex: 0 0 auto;
        width: 350px; /* Adjust as needed for card width */
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-decoration: none; /* Remove link underline */
        color: inherit;
        display: flex;
        flex-direction: column; /* Stack image-container + content vertically */
      }
  
      .linkedin-card:hover {
        transform: translateY(+7px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
      }
  
      /* A fixed-height container to ensure text starts at the same spot */
      .image-container {
        width: 100%;
        height: 100px; /* Adjust as needed for desired image area height */
        background-color: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
  
      /* The image fits entirely, possibly with "letterboxing" */
      .image-container img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      }
    `;

  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// 2. Build the carousel on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  injectLinkedInStyles();

  // The container in test.html where we insert the carousel
  const container = document.getElementById('linkedin-container');

  // Hardcoded LinkedIn-like posts (replace with real data if desired)
  // Adjust images/logos as you see fit
  let linkedInPosts = [
    {
      title: '✨Public Launch of CLARA',
      text: 'Our AI Tool is now available for free to all users! In collaboration with University of Oxford',
      image: 'logos/clara_live.png',
      link: 'https://www.linkedin.com/feed/update/urn:li:activity:7303436968514715650/'
    },
    {
      title: 'Guest speaker at UCL, MSc Business Analytics',
      text: 'Shared insights on RAG and how I’m applying it to build an AI chatbot product at the University of Oxford',
      image: 'logos/lecture.jpeg',
      link: 'https://www.linkedin.com/feed/update/urn:li:activity:7292680568645779456/'
    },
    {
      title: 'GraphRAG Tool, CLARA MVP is live!',
      text: 'AI chatbot developed in collaboration with the University of Oxford as an assistant for climate litigation',
      image: 'logos/ssme_logo.png',
      link: 'https://www.linkedin.com/feed/update/urn:li:activity:7187092382994026497/'
    },
    {
      title: 'Promoted to a Principal Data Scientist',
      text: 'Excited to take data science and analytics at MDR to the next level',
      image: 'logos/MDR.png',
      link: 'https://www.linkedin.com/posts/megpatakota_datascience-ml-dataanalytics-activity-7180863044602728448-JQ2Z'
    },
    {
      title: 'Collaboration with the University of Oxford',
      text: 'AI and climate litigation coming together.',
      image: 'logos/oxford.png',
      link: 'https://www.linkedin.com/posts/jake-rutherford_im-happy-to-share-that-im-starting-a-new-ugcPost-7112808986248114176-slxd?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB1H5D4BwtfRSWOxcQtjEs7zT0LaVw-7rmQ'
    },
    // Add or remove items here. If fewer than 4, we'll auto-duplicate them below.
  ];

  // If fewer than 4 items, duplicate them so there's enough width to scroll
  if (linkedInPosts.length < 10) {
    const original = [...linkedInPosts];
    while (linkedInPosts.length < 10) {
      linkedInPosts = linkedInPosts.concat(original);
    }
  }

  // Build our DOM structure
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'scroll-container';

  const wrapper = document.createElement('div');
  wrapper.className = 'linkedin-wrapper';

  const scrollArea = document.createElement('div');
  scrollArea.className = 'linkedin-scroll';
  scrollArea.id = 'linkedin-scroll-area';

  // Create a card for each post
  linkedInPosts.forEach((post) => {
    const card = document.createElement('a');
    card.className = 'linkedin-card';
    card.href = post.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    card.innerHTML = `
      <!-- Fixed-height image container -->
      <div class="h-[100px] w-full flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src="${post.image}"
          alt="${post.title}"
          class="max-w-full max-h-full object-contain"
        />
      </div>
    
      <!-- Text container (padded) -->
      <div class="p-0">
        <h2 class="gradient-text text-m font-semibold text-center">${post.title}</h2>
        <p class="text-xs text-gray-700 text-center">
          ${post.text}
        </p>
      </div>
    `;

    scrollArea.appendChild(card);
  });

  wrapper.appendChild(scrollArea);
  scrollContainer.appendChild(wrapper);
  container.appendChild(scrollContainer);

  // Start auto-scrolling
  initializeAutoScroll();
});

/**
 * Continuously scrolls from left to right.
 * When reaching the far right, it jumps back to the start for a rolling effect.
 */
function initializeAutoScroll() {
  const scrollArea = document.getElementById('linkedin-scroll-area');
  if (!scrollArea) {
    console.warn('LinkedIn scroll area not found.');
    return;
  }

  // Control how fast the carousel scrolls
  const scrollStep = 1;   // px per "tick"
  const scrollDelay = 30; // ms delay between each move

  setInterval(() => {
    if (scrollArea.scrollLeft >= (scrollArea.scrollWidth - scrollArea.clientWidth)) {
      // Jump back to the start
      scrollArea.scrollLeft = 0;
    } else {
      // Scroll to the right by 'scrollStep'
      scrollArea.scrollLeft += scrollStep;
    }
  }, scrollDelay);
}
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
      menuToggle.addEventListener("click", function () {
          menu.classList.toggle("hidden");
      });
  }
});
