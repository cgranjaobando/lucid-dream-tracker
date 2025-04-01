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
  
  // Initial slide position
  let currentSlideIndex = 0;
  
  // Variables for drag and swipe functionality
  let isDragging = false;
  let startDragX = 0;
  let currentDragX = 0;
  let dragThreshold = 50;
  let touchStartX = 0;
  let touchMoveX = 0;
  let touchThreshold = 50;
  
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
    if (!carousel) {
      console.error('Carousel element not found');
      return;
    }
    
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
    
    // Setup card clicks after updating the display
    setupCardClicks();
    
    // Debug info
    const cards = document.querySelectorAll('.carousel-card');
    console.log(`Carousel updated: ${cards.length} cards displayed`);
  }
  
  // Create a single carousel card
  function createCarouselCard(dayIndex, className) {
    const carousel = document.querySelector('.carousel');
    const dayActivities = plan[dayIndex];
    
    const dayCard = document.createElement('div');
    dayCard.classList.add('carousel-card', className);
    dayCard.dataset.day = dayIndex + 1;
    dayCard.dataset.activities = JSON.stringify(dayActivities);
    dayCard.dataset.cardIndex = dayIndex;
    
    // Clear any inline styles that might interfere
    dayCard.style = "";
    dayCard.style.pointerEvents = "auto"; // Ensure it accepts pointer events
    
    // Check saved state for completion
    const savedStates = JSON.parse(localStorage.getItem(`day-${dayIndex + 1}-tasks`)) || [];
    const isCompleted = savedStates.length > 0 && savedStates.every(state => state === true);
    
    if (isCompleted) {
      dayCard.classList.add('completed');
    }
    
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
    
    carousel.appendChild(dayCard);
    return dayCard;
  }
  
  // Function to ensure cards are properly clickable
  function setupCardClicks() {
    // Re-bind click events to all cards with simplified approach
    document.querySelectorAll('.carousel-card').forEach(card => {
      // Get card properties
      const day = card.dataset.day;
      const dayIndex = parseInt(card.dataset.day) - 1;
      const isCurrent = card.classList.contains('current-card');
      const isPrev = card.classList.contains('prev-card');
      const isNext = card.classList.contains('next-card');
      
      // Eliminar el proceso de clonación que está causando problemas
      // En lugar de clonar, eliminamos directamente los event listeners anteriores
      card.replaceWith(card.cloneNode(true));
      const newCard = document.querySelector(`.carousel-card[data-day="${day}"]`);
      
      // Asegurarnos de que el pointer-events esté correctamente establecido
      newCard.style.pointerEvents = 'auto';
      
      // Simplificar la detección de dispositivos
      if ('ontouchstart' in window) {
        // Para dispositivos táctiles
        newCard.addEventListener('click', function(e) {
          // Evitar la propagación del evento para prevenir doble activación
          e.stopPropagation();
          console.log(`Tarjeta ${day} presionada (${isCurrent ? 'actual' : isPrev ? 'anterior' : 'siguiente'})`);
          
          if (isPrev || isNext) {
            console.log(`Navegando a día ${day}`);
            goToSlide(dayIndex);
          } else if (isCurrent) {
            console.log(`Mostrando popup para día ${day}`);
            if (window.showDayPopup) {
              // Usar directamente newCard en lugar de this para evitar problemas de contexto
              window.showDayPopup(newCard);
            }
          }
        });
      } else {
        // Para escritorio: mejorar la detección de clics vs. arrastre
        newCard.addEventListener('mousedown', function(e) {
          // Guardar la posición inicial para comprobar si es un clic o arrastre
          const startX = e.clientX;
          const startY = e.clientY;
          let wasDragged = false;

          const handleMouseUp = function(upEvent) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Si no se arrastró mucho, considerarlo un clic
            if (!wasDragged) {
              console.log(`Clic detectado en tarjeta ${day} (${isCurrent ? 'actual' : isPrev ? 'anterior' : 'siguiente'})`);
              
              if (isPrev || isNext) {
                console.log(`Navegando a día ${day}`);
                goToSlide(dayIndex);
              } else if (isCurrent) {
                console.log(`Mostrando popup para día ${day}`);
                if (window.showDayPopup) {
                  window.showDayPopup(newCard);
                }
              }
            }
          };

          const handleMouseMove = function(moveEvent) {
            // Comprobar si el movimiento es significativo para considerarlo arrastre
            if (Math.abs(moveEvent.clientX - startX) > 5 || Math.abs(moveEvent.clientY - startY) > 5) {
              wasDragged = true;
            }
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        });
      }
    });
    
    console.log('Card click handlers reset and established');
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
      console.log(`Going to slide ${slideIndex + 1}`);
      
      // Store previous slide
      const previousSlide = currentSlideIndex;
      
      // Update current slide
      currentSlideIndex = slideIndex;
      
      // Update the display with a small delay to ensure all is updated
      setTimeout(() => {
        updateCarouselDisplay();
      }, 10);
      
      // Add a brief click delay after slide change to prevent accidental double clicks
      if (previousSlide !== currentSlideIndex) {
        // Temporarily disable clicks
        const cards = document.querySelectorAll('.carousel-card');
        cards.forEach(card => {
          card.style.pointerEvents = 'none';
        });
        
        // Re-enable clicks after animation completes
        setTimeout(() => {
          cards.forEach(card => {
            card.style.pointerEvents = 'auto';
          });
          console.log('Card interactions re-enabled');
        }, 500);
      }
    }
  }
  
  // Setup carousel controls and navigation
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
        e.preventDefault();
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
    
    // Add desktop mouse drag functionality to the main carousel
    carousel.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      carousel.style.cursor = 'grabbing';
      startDragX = e.clientX;
      currentDragX = startDragX;
      
      // Add dragging class to all cards for styling purposes
      document.querySelectorAll('.carousel-card').forEach(card => {
        card.classList.add('dragging');
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Calculate drag distance
      currentDragX = e.clientX;
      const dragDelta = currentDragX - startDragX;
      
      // Only apply visual feedback if dragged more than 5px 
      if (Math.abs(dragDelta) > 5) {
        e.preventDefault();
        
        // Move all cards proportionally to the drag distance
        const cards = document.querySelectorAll('.carousel-card');
        
        cards.forEach(card => {
          // Apply different movement amounts based on card position
          if (card.classList.contains('current-card')) {
            card.style.transform = `translateX(calc(-50% + ${dragDelta * 0.5}px)) scale(1)`;
          } else if (card.classList.contains('prev-card')) {
            card.style.transform = `translateX(calc(-25% + ${dragDelta * 0.3}px)) scale(0.85)`;
          } else if (card.classList.contains('next-card')) {
            card.style.transform = `translateX(calc(25% + ${dragDelta * 0.3}px)) scale(0.85)`;
          }
        });
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      
      const dragDistance = startDragX - currentDragX;
      
      // Remove dragging class and reset inline transforms
      document.querySelectorAll('.carousel-card').forEach(card => {
        card.classList.remove('dragging');
        card.style.transform = '';
      });
      
      isDragging = false;
      carousel.style.cursor = 'grab';
      
      // If drag was significant enough, change slide
      if (Math.abs(dragDistance) > dragThreshold) {
        if (dragDistance > 0) {
          // Dragged left, go to next slide
          goToNextSlide();
        } else {
          // Dragged right, go to previous slide
          goToPrevSlide();
        }
      } else {
        // Not enough movement, snap back to original positions
        updateCarouselDisplay();
      }
    });

    // Handle mouse leaving the window
    document.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        carousel.style.cursor = 'grab';
        
        // Reset all cards if mouse leaves window during drag
        document.querySelectorAll('.carousel-card').forEach(card => {
          card.classList.remove('dragging');
          card.style.transform = '';
        });
        
        // Ensure proper display is restored
        updateCarouselDisplay();
      }
    });
    
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
    
    // Touch swipe functionality with visual feedback
    carousel.addEventListener('touchstart', (e) => {
      // Prevent default only on direct carousel touch to avoid scroll issues
      if (e.target === carousel) {
        e.preventDefault();
      }
      
      touchStartX = e.touches[0].clientX;
      touchMoveX = touchStartX;
      
      // Add dragging class to cards when touch starts
      document.querySelectorAll('.carousel-card').forEach(card => {
        card.classList.add('touch-dragging');
      });
    });

    carousel.addEventListener('touchmove', (e) => {
      if (!touchStartX) return;
      
      // Update current touch position
      touchMoveX = e.touches[0].clientX;
      const touchDelta = touchMoveX - touchStartX;
      
      // Only apply visual feedback if moved more than 5px
      if (Math.abs(touchDelta) > 5) {
        // Only prevent default for horizontal drags to avoid blocking vertical scrolling
        if (Math.abs(touchDelta) > Math.abs(e.touches[0].clientY - e.touches[0].clientY)) {
          e.preventDefault();
        }
        
        // Move cards with finger for immediate visual feedback
        const cards = document.querySelectorAll('.carousel-card');
        cards.forEach(card => {
          // Apply different movement amounts based on card position
          if (card.classList.contains('current-card')) {
            card.style.transform = `translateX(calc(-50% + ${touchDelta * 0.5}px)) scale(1)`;
          } else if (card.classList.contains('prev-card')) {
            card.style.transform = `translateX(calc(-25% + ${touchDelta * 0.3}px)) scale(0.85)`;
          } else if (card.classList.contains('next-card')) {
            card.style.transform = `translateX(calc(25% + ${touchDelta * 0.3}px)) scale(0.85)`;
          }
        });
      }
    });

    carousel.addEventListener('touchend', () => {
      // Flag to determine if this was a tap vs. a swipe
      const wasTap = touchStartX === touchMoveX || !touchMoveX;
      
      // Remove the touch-dragging class
      document.querySelectorAll('.carousel-card').forEach(card => {
        card.classList.remove('touch-dragging');
        card.style.transform = ''; // Reset inline styles
      });
      
      if (!wasTap && touchStartX && touchMoveX) {
        const touchDiff = touchStartX - touchMoveX;
        
        if (Math.abs(touchDiff) > touchThreshold) {
          if (touchDiff > 0) {
            // Swipe left, go to next slide
            goToNextSlide();
          } else {
            // Swipe right, go to previous slide
            goToPrevSlide();
          }
        } else {
          // Not enough movement, restore positions
          updateCarouselDisplay();
        }
      }
      
      // Reset touch values
      touchStartX = null;
      touchMoveX = null;
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
  
  // Set up the carousel controls
  setupCarouselControls();
  
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