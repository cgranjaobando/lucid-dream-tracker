/**
 * Carousel functionality for the Lucid Dreams App
 * Implementation of infinite carousel with three visible cards
 */

let carouselInitialized = false; // Flag to prevent multiple initializations

// Definir las funciones globales fuera de initializeCarousel
let currentSlideIndex = 0;

// Forward declarations of functions that need to be globally available
let goToNextSlide, goToPrevSlide, goToSlide, updateCarouselDisplay;

// Add this function near the top of the file, after the variable declarations
function isClickWithinCardBounds(event, card) {
  const rect = card.getBoundingClientRect();
  const x = event.clientX || (event.touches && event.touches[0].clientX);
  const y = event.clientY || (event.touches && event.touches[0].clientY);
  
  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousel once plan data is available
  if (typeof plan === 'undefined') {
    // Wait a bit for plan to be defined from utils.js
    setTimeout(initializeCarousel, 200);
  } else {
    initializeCarousel();
  }
});

// Add this emergency fix helper at the document level
document.addEventListener('DOMContentLoaded', function() {
  // Add a function to force fix two-item lists
  window.forceFixTwoItemLists = function() {
    document.querySelectorAll('.activities-list').forEach(list => {
      const items = list.querySelectorAll('span');
      if (items.length <= 2) {
        // Basic class and style
        list.classList.add('two-items-or-less');
        list.classList.remove('scrollable');
        list.style.overflow = 'hidden';
        list.style.overflowY = 'hidden';
        
        // Hide indicator
        const indicator = list.closest('.activities-wrapper')?.querySelector('.activities-list-indicator');
        if (indicator) {
          indicator.style.display = 'none';
          indicator.classList.remove('visible');
        }
      }
    });
  };
  
  // Run once immediately
  setTimeout(window.forceFixTwoItemLists, 500);
  
  // Then periodically check and fix
  setInterval(window.forceFixTwoItemLists, 2000);
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

  // Asignar las funciones a las variables globales que declaramos arriba
  updateCarouselDisplay = function() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) {
      console.error('Carousel element not found');
      return;
    }
    
    // Store the previous slide direction
    const wasMovingLeft = document.querySelector('.carousel-card.moving-left');
    const wasMovingRight = document.querySelector('.carousel-card.moving-right');
    
    // Clear carousel with proper positioning
    carousel.innerHTML = '';
    
    // Get indices for visible cards
    const prevIndex = getSlideIndex(currentSlideIndex - 1);
    const nextIndex = getSlideIndex(currentSlideIndex + 1);
    
    // Add all three cards with proper positioning
    const prevCard = createCarouselCard(prevIndex, 'prev-card');
    const currentCard = createCarouselCard(currentSlideIndex, 'current-card');
    const nextCard = createCarouselCard(nextIndex, 'next-card');
    
    // Apply entrance animations based on previous direction
    if (wasMovingLeft) {
      prevCard.classList.add('entering-left');
    }
    if (wasMovingRight) {
      nextCard.classList.add('entering-right');
    }
    
    // Update indicators and small cards
    updateIndicators();
    updateSmallCards();
    
    // Setup card clicks after updating the display
    setupCardClicks();
    
    // Limpiar clases y estilos transitorios de todas las tarjetas
    const clearAllTransitions = () => {
      document.querySelectorAll('.carousel-card').forEach(card => {
        card.classList.remove('entering-left', 'entering-right', 'moving-left', 'moving-right', 'clicked', 'pre-moving');
        // Limpiar absolutamente todos los estilos inline
        card.style = "";
        card.style.pointerEvents = 'auto';
      });
      
      // Asegurarse de eliminar la clase de transición activa
      document.body.classList.remove('carousel-transition-active');
      
      // Check if each activities list needs scrolling
      document.querySelectorAll('.activities-list').forEach(list => {
        const indicatorElement = list.closest('.activities-wrapper')?.querySelector('.activities-list-indicator');
        checkIfScrollable(list, indicatorElement);
      });
    };
    
    // Limpia las transiciones después de completar la animación
    setTimeout(clearAllTransitions, 350);
  };
  
  // Create a single carousel card - modify the activities list handling with a direct style approach
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
    
    // Updated HTML structure with activities-wrapper and a direct style attribute for 2 or fewer activities
    const activityCount = dayActivities.length;
    const needsScrolling = activityCount > 2;
    
    dayCard.innerHTML = `
      <div class="card-content">
        <div class="card-image-area">
          <h3>Día ${dayIndex + 1}</h3>
          <!-- Placeholder for future image -->
        </div>
        <div class="activities-wrapper">
          <div class="activities-list${!needsScrolling ? ' two-items-or-less' : ''}" 
               data-scrollable="${needsScrolling}" 
               style="${!needsScrolling ? 'overflow:hidden !important; overflow-y:hidden !important' : ''}"
               ontouchstart="event.stopPropagation();">
            ${dayActivities.map(act => `<span>${act}</span>`).join('')}
          </div>
          <div class="activities-list-indicator" ${!needsScrolling ? 'style="display:none!important;opacity:0!important"' : ''}></div>
        </div>
      </div>
    `;
    
    // Improved event handling
    setTimeout(() => {
      const activitiesList = dayCard.querySelector('.activities-list');
      const indicatorElement = dayCard.querySelector('.activities-list-indicator');
      
      if (activitiesList && indicatorElement) {
        // Get all activity items in this card
        const activities = dayCard.querySelectorAll('.activities-list span');
        
        // If we have 2 or fewer items, force non-scrollable state with multiple approaches
        if (activities.length <= 2) {
          console.log(`Day ${dayIndex+1} has ${activities.length} activities - AGGRESSIVE non-scrollable enforcement`);
          
          // Class-based approach
          activitiesList.classList.add('two-items-or-less');
          activitiesList.classList.remove('scrollable');
          
          // Direct style approach
          activitiesList.style.setProperty('overflow', 'hidden', 'important');
          activitiesList.style.setProperty('overflow-y', 'hidden', 'important'); 
          activitiesList.style.setProperty('scrollbar-width', 'none', 'important');
          activitiesList.style.setProperty('-ms-overflow-style', 'none', 'important');
          
          // Handle the indicator
          indicatorElement.classList.remove('visible');
          indicatorElement.style.setProperty('display', 'none', 'important');
          indicatorElement.style.setProperty('opacity', '0', 'important');
          
          // Fix again after a delay to catch any race conditions
          setTimeout(() => {
            activitiesList.classList.add('two-items-or-less');
            activitiesList.style.setProperty('overflow', 'hidden', 'important');
            indicatorElement.classList.remove('visible');
            indicatorElement.style.setProperty('opacity', '0', 'important');
          }, 300);
        } else {
          // Only check scrollability if we have more than 2 items
          activitiesList.classList.remove('two-items-or-less');
          checkIfScrollable(activitiesList, indicatorElement);
        }
        
        // Force pointer-events to work by adding these handlers
        activitiesList.addEventListener('mousedown', function(e) {
          e.stopPropagation();
        }, true);
        
        activitiesList.addEventListener('click', function(e) {
          e.stopPropagation();
        }, true);
        
        activitiesList.addEventListener('touchstart', function(e) {
          // Don't stop propagation, but mark the event as handled
          e._handledByList = true;
        }, true);
        
        // Add scroll event listener to capture all scrolling events
        activitiesList.addEventListener('scroll', function() {
          clearTimeout(this._scrollTimeout);
          this._scrollTimeout = setTimeout(() => {
            updateScrollIndicator(this, indicatorElement);
          }, 50); // Slightly longer timeout for smoother UI
        });
        
        // Fix initial scrollbar visibility by forcing a reflow
        setTimeout(() => {
          checkIfScrollable(activitiesList, indicatorElement);
        }, 250);
      }
    }, 200); // Slightly longer timeout to ensure content is fully rendered
    
    // Run another check after the card is fully rendered
    setTimeout(() => {
      const activitiesList = dayCard.querySelector('.activities-list');
      const activities = dayCard.querySelectorAll('.activities-list span');
      
      if (activities.length <= 2 && activitiesList) {
        activitiesList.classList.add('two-items-or-less');
        activitiesList.style.setProperty('overflow', 'hidden', 'important');
        
        const indicator = dayCard.querySelector('.activities-list-indicator');
        if (indicator) {
          indicator.classList.remove('visible');
          indicator.style.setProperty('display', 'none', 'important');
        }
      }
    }, 500);
    
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
            // Añadir clase de clic para mejor animación
            newCard.classList.add('clicked');
            
            // Aumentar el retraso para igualar con las flechas del carrusel
            setTimeout(() => {
              goToSlide(dayIndex);
            }, 350); // Aumentado de 250ms a 350ms para igualar con las flechas
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
                
                // Añadir clase de clic para mejor feedback visual
                newCard.classList.add('clicked');
                
                // Aumentar el retraso para igualar con las flechas del carrusel
                setTimeout(() => {
                  goToSlide(dayIndex);
                }, 350); // Aumentado de 250ms a 350ms para igualar con las flechas
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
  
  // Function to go to next slide with enhanced animation
  goToNextSlide = function() {
    // Get the current cards
    const prevCard = document.querySelector('.carousel-card.prev-card');
    const currentCard = document.querySelector('.carousel-card.current-card');
    const nextCard = document.querySelector('.carousel-card.next-card');
    
    // Añadir un bloqueo temporal para prevenir clics múltiples
    if (document.querySelector('.carousel-transition-active')) {
      return; // Evita múltiples transiciones simultáneas
    }
    document.body.classList.add('carousel-transition-active');
    
    // Primero manipular la tarjeta next porque será la principal
    if (nextCard) {
      nextCard.style.zIndex = '20'; // Mayor prioridad para la que será la nueva tarjeta central
    }
    
    // INMEDIATAMENTE reducir el z-index de la tarjeta current
    if (currentCard) {
      currentCard.style.zIndex = '1'; // Valor aún más bajo para garantizar que quede debajo
    }
    
    // Pequeño retraso antes de iniciar las animaciones
    setTimeout(() => {
      if (nextCard) {
        nextCard.classList.add('moving-left');
        nextCard.style.pointerEvents = 'none';
      }
      
      if (currentCard) {
        currentCard.classList.add('moving-left');
        currentCard.style.pointerEvents = 'none';
      }
      
      if (prevCard) {
        prevCard.classList.add('moving-left');
        prevCard.style.opacity = '0';
        prevCard.style.pointerEvents = 'none';
      }
    }, 5); // Un retraso mínimo de 5ms
    
    // Tiempo exacto para ambas direcciones
    setTimeout(() => {
      currentSlideIndex = getSlideIndex(currentSlideIndex + 1);
      updateCarouselDisplay();
      
      // Eliminar el bloqueo después de la transición
      setTimeout(() => {
        document.body.classList.remove('carousel-transition-active');
      }, 100);
    }, 350);
  };
  
  // Function to go to previous slide with enhanced animation
  goToPrevSlide = function() {
    // Get the current cards
    const prevCard = document.querySelector('.carousel-card.prev-card');
    const currentCard = document.querySelector('.carousel-card.current-card');
    const nextCard = document.querySelector('.carousel-card.next-card');
    
    // Añadir un bloqueo temporal para prevenir clics múltiples
    if (document.querySelector('.carousel-transition-active')) {
      return; // Evita múltiples transiciones simultáneas
    }
    document.body.classList.add('carousel-transition-active');
    
    // Primero manipular la tarjeta prev porque será la principal
    if (prevCard) {
      prevCard.style.zIndex = '20'; // Mayor prioridad para la que será la nueva tarjeta central
    }
    
    // INMEDIATAMENTE reducir el z-index de la tarjeta current
    if (currentCard) {
      currentCard.style.zIndex = '1'; // Valor aún más bajo para garantizar que quede debajo
    }
    
    // Pequeño retraso antes de iniciar las animaciones
    setTimeout(() => {
      if (prevCard) {
        prevCard.classList.add('moving-right');
        prevCard.style.pointerEvents = 'none';
      }
      
      if (currentCard) {
        currentCard.classList.add('moving-right');
        currentCard.style.pointerEvents = 'none';
      }
      
      if (nextCard) {
        nextCard.classList.add('moving-right');
        nextCard.style.opacity = '0';
        nextCard.style.pointerEvents = 'none';
      }
    }, 5); // Un retraso mínimo de 5ms
    
    // Usar el mismo tiempo que en goToNextSlide
    setTimeout(() => {
      currentSlideIndex = getSlideIndex(currentSlideIndex - 1);
      updateCarouselDisplay();
      
      // Eliminar el bloqueo después de la transición
      setTimeout(() => {
        document.body.classList.remove('carousel-transition-active');
      }, 100);
    }, 350);
  };
  
  // Function to go to a specific slide with smoother transition
  goToSlide = function(slideIndex) {
    if (slideIndex >= 0 && slideIndex < plan.length) {
      console.log(`Going to slide ${slideIndex + 1}`);
      
      // Calculate direction of movement
      const direction = slideIndex > currentSlideIndex ? 'left' : 'right';
      
      // Add appropriate animation class based on direction
      const cards = document.querySelectorAll('.carousel-card');
      cards.forEach(card => {
        if (direction === 'left') {
          card.classList.add('moving-left');
        } else if (direction === 'right') {
          card.classList.add('moving-right');
        }
        // Temporarily disable pointer events during transition
        card.style.pointerEvents = 'none';
      });
      
      // Store previous slide
      const previousSlide = currentSlideIndex;
      
      // Update current slide
      currentSlideIndex = slideIndex;
      
      // Update the display with a delay for animation
      setTimeout(() => {
        updateCarouselDisplay();
        // Re-enable clicks after animation completes
        cards.forEach(card => {
          card.style.pointerEvents = 'auto';
          card.classList.remove('clicked'); // Ensure no residual state
        });
        console.log('Card interactions re-enabled');
      }, 400);
    }
  };

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
      smallCarousel.style.cursor = 'grab';
      
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
      const clickedCard = e.target.closest('.carousel-card');
      if (!clickedCard || !isClickWithinCardBounds(e, clickedCard)) {
        return; // Only proceed if click is inside a card's bounds
      }
      
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
      const cards = document.querySelectorAll('.carousel-card');
      const dragPercentage = dragDelta / window.innerWidth;
      const maxDrag = window.innerWidth * 0.25; // Limit the drag distance for visual consistency
      const normDelta = Math.max(Math.min(dragDelta, maxDrag), -maxDrag);
      
      cards.forEach(card => {
        if (card.classList.contains('current-card')) {
          card.style.transform = `translateX(calc(-50% + ${normDelta * 0.8}px)) scale(${1 - Math.abs(dragPercentage) * 0.05})`;
        } else if (card.classList.contains('prev-card')) {
          card.style.transform = `translateX(calc(-50% + ${normDelta * 0.3}px)) scale(0.85)`;
          card.style.opacity = `${0.8 + Math.max(0, dragPercentage) * 0.2}`;
        } else if (card.classList.contains('next-card')) {
          card.style.transform = `translateX(calc(50% + ${normDelta * 0.3}px)) scale(0.85)`;
          card.style.opacity = `${0.8 + Math.max(0, -dragPercentage) * 0.2}`;
        }
      });
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
      // Check if the touch is within an activities-list
      if (e.target.closest('.activities-list')) {
        // Let the native scrolling handle this
        return;
      }
      
      const touchedCard = e.target.closest('.carousel-card');
      if (!touchedCard || !isClickWithinCardBounds(e, touchedCard)) {
        return; // Only proceed if touch is inside a card's bounds
      }
      
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
      const cards = document.querySelectorAll('.carousel-card');
      const dragPercentage = touchDelta / window.innerWidth;
      const maxDrag = window.innerWidth * 0.25; // Limit the drag distance
      const normDelta = Math.max(Math.min(touchDelta, maxDrag), -maxDrag);
      
      cards.forEach(card => {
        if (card.classList.contains('current-card')) {
          card.style.transform = `translateX(calc(-50% + ${normDelta * 0.8}px)) scale(${1 - Math.abs(dragPercentage) * 0.05})`;
        } else if (card.classList.contains('prev-card')) {
          card.style.transform = `translateX(calc(-50% + ${normDelta * 0.3}px)) scale(0.85)`;
          card.style.opacity = `${0.8 + Math.max(0, dragPercentage) * 0.2}`;
        } else if (card.classList.contains('next-card')) {
          card.style.transform = `translateX(calc(50% + ${normDelta * 0.3}px)) scale(0.85)`;
          card.style.opacity = `${0.8 + Math.max(0, -dragPercentage) * 0.2}`;
        }
      });
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
  }
  
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

  // Initialize the first display
  updateCarouselDisplay();
  
  // Set up the carousel controls
  setupCarouselControls();
  
  // Make functions globally accessible - now this should work
  window.navigateToSlide = goToSlide;
  window.goToNextSlide = goToNextSlide;
  window.goToPrevSlide = goToPrevSlide;
  window.goToSlide = goToSlide;
}

// Add a small utility CSS rule to the document head for transition blocking
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .carousel-transition-active .carousel-card {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
});

// Simplify the check for two-items-or-less in checkIfScrollable
function checkIfScrollable(element, indicatorElement) {
  if (!element || !indicatorElement) return false;
  
  // Quick direct item count check first
  const items = element.querySelectorAll('span');
  const itemCount = items.length;
  
  // Special handling for 2 or fewer items
  if (itemCount <= 2) {
    // Simple direct approach
    element.classList.add('two-items-or-less');
    element.classList.remove('scrollable');
    element.style.overflow = 'hidden';
    element.style.overflowY = 'hidden';
    indicatorElement.style.display = 'none';
    indicatorElement.classList.remove('visible');
    return false;
  }
  
  // For more than 2 items, use the standard check
  element.classList.remove('two-items-or-less');
  element.style.overflow = 'auto';
  
  // Standard scrollability check
  const isScrollable = Math.ceil(element.scrollHeight) > (element.clientHeight + 5);
  
  // Use more margin (5px) to avoid showing scrollbars for just minimal differences
  const isScrollableWithMargin = Math.ceil(element.scrollHeight) > (element.clientHeight + 5);
  
  // Always remove existing classes first
  element.classList.remove('scrollable');
  indicatorElement.classList.remove('visible');
  
  // Add classes only if truly scrollable
  if (isScrollableWithMargin) {
    console.log("Container is scrollable, enabling scrollbar and indicator");
    element.classList.add('scrollable');
    
    // Only check position if actually scrollable
    updateScrollIndicator(element, indicatorElement);
    
    // Handle mousewheel events for desktop
    if (!element._wheelEventSet) {
      element._wheelEventSet = true; // Flag to prevent duplicate handlers
      
      // Remove any existing listeners first
      element.removeEventListener('wheel', element._wheelHandler);
      
      // Create a new handler
      element._wheelHandler = function(e) {
        // Stop propagation to prevent card interactions
        e.stopPropagation();
        
        // Allow default browser behavior for smoother scrolling
        // But prevent parent elements from scrolling
        const isAtTop = this.scrollTop <= 0;
        const isAtBottom = Math.ceil(this.scrollTop + this.clientHeight) >= Math.floor(this.scrollHeight);
        
        if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
          e.preventDefault(); // Prevent overscroll only at boundaries
        }
        
        // Update indicator after a small delay to ensure accurate position
        clearTimeout(this._indicatorTimeout);
        this._indicatorTimeout = setTimeout(() => {
          updateScrollIndicator(this, indicatorElement);
        }, 20);
      };
      
      // Add wheel handler
      element.addEventListener('wheel', element._wheelHandler, { passive: false });
      
      // Also ensure scrolling shows the indicator
      element.addEventListener('scroll', function() {
        clearTimeout(this._indicatorTimeout);
        this._indicatorTimeout = setTimeout(() => {
          updateScrollIndicator(this, indicatorElement);
        }, 20);
      });
    }
  } else {
    console.log("Container is NOT scrollable, hiding scrollbar and indicator");
  }
  
  return isScrollableWithMargin;
}

// Updated function to control indicator visibility with stricter conditions
function updateScrollIndicator(element, indicatorElement) {
  if (!element || !indicatorElement) return;
  
  // More strict check for scrollability with larger threshold
  const isScrollable = Math.ceil(element.scrollHeight) > (element.clientHeight + 5);
  
  if (isScrollable) {
    element.classList.add('scrollable');
    
    // Only show indicator if not near bottom with a stricter threshold
    const isNearBottom = (element.scrollHeight - Math.ceil(element.scrollTop) - element.clientHeight) < 8;
    
    if (isNearBottom) {
      // At bottom - hide indicator
      indicatorElement.classList.remove('visible');
    } else if (element.scrollTop > 0) {
      // Scrolled down but not at bottom - show indicator
      indicatorElement.classList.add('visible');
    } else {
      // At top with more content below - show indicator
      indicatorElement.classList.add('visible');
    }
  } else {
    // Not enough content to scroll - hide everything
    element.classList.remove('scrollable');
    indicatorElement.classList.remove('visible');
  }
}

// Make initialization function available globally
window.initializeCarousel = initializeCarousel;