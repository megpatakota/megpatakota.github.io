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
        max-width: 900px; /* Adjust as needed */
      }
  
      /* Wrapper around the scrollable area */
      .linkedin-wrapper {
        position: relative;
        overflow: hidden;
        border: 1px solid #e2e2e2;
        border-radius: 6px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
        width: 250px; /* Adjust as needed for card width */
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
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
      }
  
      /* A fixed-height container to ensure text starts at the same spot */
      .image-container {
        width: 100%;
        height: 140px; /* Adjust as needed for desired image area height */
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
  
      /* Card content below the image */
      .linkedin-content {
        padding: 0.75rem 1rem;
        flex: 1; /* Expand to fill available vertical space */
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* Start text at the top */
      }
  
      .linkedin-content h4 {
        margin: 0 0 0.4rem;
        font-size: 1rem;
        color: #0072b1; /* LinkedIn blue */
        line-height: 1.3;
      }
  
      .linkedin-content p {
        margin: 0;
        font-size: 0.875rem;
        color: #555;
        line-height: 1.3;
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
        title: 'Guest speaker at UCL, MSc Business Analytics',
        text: 'Shared insights on RAG and how I’m applying it to build an AI chatbot product at the University of Oxford',
        image: 'logos/lecture.jpeg',
        link: 'https://www.linkedin.com/feed/update/urn:li:activity:7292680568645779456/'
      },
      {
        title: 'GraphRAG Tool, CLARA is live',
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
      // Add or remove items here. If fewer than 4, we'll auto-duplicate them below.
    ];
  
    // If fewer than 4 items, duplicate them so there's enough width to scroll
    if (linkedInPosts.length < 4) {
      const original = [...linkedInPosts];
      while (linkedInPosts.length < 4) {
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
        <div class="image-container">
          <img src="${post.image}" alt="${post.title}" />
        </div>
        <div class="linkedin-content">
          <h4>${post.title}</h4>
          <p>${post.text}</p>
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
  