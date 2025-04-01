/**
 * Carousel functionality for the Lucid Dreams App
 * Implementation of infinite carousel with three visible cards
 */

let carouselInitialized = false; // Flag to prevent multiple initializations

document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousel once plan data is available
  if (typeof plan === 'undefined') {
    // Wait a bit for plan to be defined from utils.js
    setTimeout(initializeCarousel, 200);
  } else {
    initializeCarousel();
  }
});

// Initialize the carousel with three cards visible at once
function initializeCarousel() {
  // Prevent multiple initializations
  if (carouselInitialized) return;
  
  // Make sure plan is defined
  if (typeof plan === 'undefined') {
    console.warn('Plan data not available yet for carousel');
    setTimeout(initializeCarousel, 200);
    return;
  }
  
  console.log('Initializing carousel with plan data');
  carouselInitialized = true; // Set flag to prevent re-initialization
  
  // Setup carousel controls and navigation
  setupCarouselControls();
  
  // Initial slide position
  let currentSlideIndex = 0;
  
  // Function to get proper slide index (for infinite loop)
  function getSlideIndex(index) {
    const totalSlides = plan.length;
    // Handle negative indices (for previous slides)
    if (index < 0) return totalSlides - 1;
    // Handle indices greater than array length (for next slides)
    if (index >= totalSlides) return 0;
    return index;
  }
  
  // Function to update carousel display
  function updateCarouselDisplay() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    // Get indices for visible cards (previous, current, next)
    const prevIndex = getSlideIndex(currentSlideIndex - 1);
    const nextIndex = getSlideIndex(currentSlideIndex + 1);
    
    // Clear carousel
    carousel.innerHTML = '';
    
    // Create and add previous day card
    createCarouselCard(prevIndex, 'prev-card');
    
    // Create and add current day card
    createCarouselCard(currentSlideIndex, 'current-card');
    
    // Create and add next day card
    createCarouselCard(nextIndex, 'next-card');
    
    // Update indicators
    updateIndicators();
    
    // Update small cards
    updateSmallCards();
  }
  
  /**
   * Create a single carousel card - restructured for future image placement
   */
  function createCarouselCard(dayIndex, className) {
    const carousel = document.querySelector('.carousel');
    const dayActivities = plan[dayIndex];
    
    const dayCard = document.createElement('div');
    dayCard.classList.add('carousel-card', className);
    dayCard.dataset.day = dayIndex + 1;
    dayCard.dataset.activities = JSON.stringify(dayActivities);
    
    // Check saved state for completion
    const savedStates = JSON.parse(localStorage.getItem(`day-${dayIndex + 1}-tasks`)) || [];
    const isCompleted = savedStates.length > 0 && savedStates.every(state => state === true);
    
    if (isCompleted) {
      dayCard.classList.add('completed');
    }
    
    // Restructured card content with image area on top and activities at bottom
    dayCard.innerHTML = `
      <div class="card-content">
        <div class="card-image-area">
          <h3>Día ${dayIndex + 1}</h3>
          <!-- Placeholder for future image -->
        </div>
        <div class="activities-list">
          ${dayActivities.map(act => `<span>${act}</span>`).join('')}
        </div>
      </div>
    `;
    
    dayCard.addEventListener('click', function() {
      if (window.showDayPopup) {
        window.showDayPopup(this);
      }
    });
    
    carousel.appendChild(dayCard);
    return dayCard;
  }
  
  // Update indicators
  function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    
    indicators.forEach((indicator, index) => {
      if (index === currentSlideIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // Update small cards
  function updateSmallCards() {
    const smallCards = document.querySelectorAll('.small-card');
    
    smallCards.forEach((card, index) => {
      if (index === currentSlideIndex) {
        card.classList.add('active');
        // Ensure active card is visible in the scroll view
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('active');
      }
    });
  }
  
  // Function to go to next slide
  function goToNextSlide() {
    currentSlideIndex = getSlideIndex(currentSlideIndex + 1);
    updateCarouselDisplay();
  }
  
  // Function to go to previous slide
  function goToPrevSlide() {
    currentSlideIndex = getSlideIndex(currentSlideIndex - 1);
    updateCarouselDisplay();
  }
  
  // Function to go to a specific slide
  function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < plan.length) {
      currentSlideIndex = slideIndex;
      updateCarouselDisplay();
    }
  }
  
  // Setup carousel controls
  function setupCarouselControls() {
    const carousel = document.querySelector('.carousel');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (!carouselContainer || !carousel) {
      console.warn('Carousel container or carousel not found');
      return;
    }
    
    // Initialize indicators
    const indicators = document.querySelector('.carousel-indicators');
    if (indicators) {
      indicators.innerHTML = '';
      plan.forEach((_, i) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        indicator.dataset.slide = i;
        indicator.addEventListener('click', () => goToSlide(i));
        indicators.appendChild(indicator);
      });
    }
    
    // Initialize small carousel cards
    const smallCarousel = document.querySelector('.small-carousel');
    if (smallCarousel) {
      smallCarousel.innerHTML = '';
      plan.forEach((activities, i) => {
        const smallCard = document.createElement('div');
        smallCard.classList.add('small-card');
        smallCard.dataset.day = i + 1;
        
        // Check saved state for completion
        const savedStates = JSON.parse(localStorage.getItem(`day-${i + 1}-tasks`)) || [];
        const isCompleted = savedStates.length > 0 && savedStates.every(state => state === true);
        
        if (isCompleted) {
          smallCard.classList.add('completed');
        }
        
        smallCard.innerHTML = `<span>${i + 1}</span>`;
        smallCard.addEventListener('click', () => goToSlide(i));
        smallCarousel.appendChild(smallCard);
      });
      
      // Make small carousel horizontally scrollable with mouse drag
      let isDown = false;
      let startX;
      let scrollLeft;
      
      smallCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        smallCarousel.style.cursor = 'grabbing';
        startX = e.pageX - smallCarousel.offsetLeft;
        scrollLeft = smallCarousel.scrollLeft;
      });
      
      smallCarousel.addEventListener('mouseleave', () => {
        isDown = false;
        smallCarousel.style.cursor = 'grab';
      });
      
      smallCarousel.addEventListener('mouseup', () => {
        isDown = false;
        smallCarousel.style.cursor = 'grab';
      });
      
      smallCarousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - smallCarousel.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        smallCarousel.scrollLeft = scrollLeft - walk;
      });
    }
    
    // Add navigation buttons
    if (!carouselContainer.querySelector('.prev-btn')) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-nav prev-btn';
      prevBtn.innerHTML = '&lsaquo;';
      prevBtn.addEventListener('click', goToPrevSlide);
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-nav next-btn';
      nextBtn.innerHTML = '&rsaquo;';
      nextBtn.addEventListener('click', goToNextSlide);
      
      carouselContainer.appendChild(prevBtn);
      carouselContainer.appendChild(nextBtn);
    }
    
    // Touch swipe functionality
    let startX, moveX;
    
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchmove', (e) => {
      moveX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', () => {
      if (startX && moveX) {
        const diff = startX - moveX;
        
        if (Math.abs(diff) > 50) {  // Minimum swipe distance
          if (diff > 0) {
            // Swipe left, go to next slide
            goToNextSlide();
          } else {
            // Swipe right, go to previous slide
            goToPrevSlide();
          }
        }
      }
      
      // Reset values
      startX = null;
      moveX = null;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only respond to arrow keys if carousel view is active
      if (document.getElementById('carouselView').style.display !== 'none') {
        if (e.key === 'ArrowRight') {
          goToNextSlide();
        } else if (e.key === 'ArrowLeft') {
          goToPrevSlide();
        }
      }
    });
  }
  
  // Initialize the first display
  updateCarouselDisplay();
  
  // Make functions globally accessible
  window.navigateToSlide = goToSlide;
  window.goToNextSlide = goToNextSlide;
  window.goToPrevSlide = goToPrevSlide;
  window.goToSlide = goToSlide;
}

// Make initialization function available globally
window.initializeCarousel = initializeCarousel;