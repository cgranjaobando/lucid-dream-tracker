// This file manages the new carousel view mode, including rendering the day cards and the smaller squares.

/**
 * Carousel View Controller
 * Handles the infinite carousel display and interactions
 */

// Function to initialize the carousel view
function initializeCarouselView() {
  const carousel = document.querySelector('.carousel');
  const smallCarousel = document.querySelector('.small-carousel');
  const indicators = document.querySelector('.carousel-indicators');
  
  if (!carousel || !smallCarousel || !indicators) return;
  
  // Clear existing content
  carousel.innerHTML = '';
  smallCarousel.innerHTML = '';
  indicators.innerHTML = '';
  
  // Create carousel cards and indicators
  plan.forEach((activities, i) => {
    // Create main carousel card
    const dayCard = document.createElement('div');
    dayCard.classList.add('carousel-card');
    dayCard.dataset.day = i + 1;
    dayCard.dataset.activities = JSON.stringify(activities);
    
    // Check saved state for completion
    const savedStates = JSON.parse(localStorage.getItem(`day-${i + 1}-tasks`)) || [];
    const isCompleted = savedStates.length > 0 && savedStates.every(state => state === true);
    
    if (isCompleted) {
      dayCard.classList.add('completed');
    }
    
    dayCard.innerHTML = `
      <div class="card-content">
        <h3>Día ${i + 1}</h3>
        <div class="activities-list">${activities.map(act => `<span>${act}</span>`).join('')}</div>
      </div>
    `;
    
    dayCard.addEventListener('click', () => window.showDayPopup(dayCard));
    carousel.appendChild(dayCard);
    
    // Create small carousel indicator
    const smallCard = document.createElement('div');
    smallCard.classList.add('small-card');
    smallCard.dataset.day = i + 1;
    
    if (isCompleted) {
      smallCard.classList.add('completed');
    }
    
    smallCard.innerHTML = `<span>${i + 1}</span>`;
    smallCard.addEventListener('click', () => navigateToSlide(i));
    smallCarousel.appendChild(smallCard);
    
    // Create indicator dot
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    indicator.dataset.slide = i;
    indicator.addEventListener('click', () => navigateToSlide(i));
    indicators.appendChild(indicator);
  });
  
  // Initialize carousel functionality
  setupCarousel();
}

// Set up carousel interaction functionality
function setupCarousel() {
  const carousel = document.querySelector('.carousel');
  const indicators = document.querySelectorAll('.indicator');
  const smallCards = document.querySelectorAll('.small-card');
  let currentSlide = 0;
  const totalSlides = plan.length;
  
  // Set initial state
  updateCarouselState();
  
  // Function to update carousel position and active states
  function updateCarouselState() {
    // Update main carousel position
    carousel.style.transform = `translateX(-${currentSlide * 33.33}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
    
    // Update small cards
    smallCards.forEach((card, index) => {
      if (index === currentSlide) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('active');
      }
    });
  }
  
  // Add touch swipe functionality
  let startX, moveX;
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  carousel.addEventListener('touchmove', (e) => {
    moveX = e.touches[0].clientX;
  });
  
  carousel.addEventListener('touchend', () => {
    if (startX - moveX > 50 && currentSlide < totalSlides - 1) {
      // Swipe left, go to next slide
      currentSlide++;
      updateCarouselState();
    } else if (moveX - startX > 50 && currentSlide > 0) {
      // Swipe right, go to previous slide
      currentSlide--;
      updateCarouselState();
    }
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
      // Right arrow, go to next slide
      currentSlide++;
      updateCarouselState();
    } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
      // Left arrow, go to previous slide
      currentSlide--;
      updateCarouselState();
    }
  });
}

// Make functions available globally
window.initializeCarouselView = initializeCarouselView;
window.setupCarousel = setupCarousel;