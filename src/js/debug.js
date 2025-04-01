/**
 * Debug utilities for the Lucid Dreams App
 * This file contains functions to help diagnose and fix interaction issues
 */

// Global flag to enable/disable debug mode - Set to false to hide debug buttons
window.debugMode = false; // Changed from true to false to hide debug UI elements

// Enhanced logging function that only logs when debug mode is on
function debugLog(...args) {
  if (window.debugMode) {
    console.log(...args);
  }
}

// Function to inspect event handling in the carousel
function inspectCarouselEvents() {
  if (!window.debugMode) return;
  
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  // Track all events on carousel
  const eventsToTrack = ['click', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'];
  
  eventsToTrack.forEach(eventType => {
    carousel.addEventListener(eventType, (e) => {
      console.log(`Carousel ${eventType} event:`, {
        type: eventType,
        target: e.target.tagName,
        x: eventType.includes('mouse') ? e.clientX : (e.touches ? e.touches[0].clientX : 'N/A'),
        y: eventType.includes('mouse') ? e.clientY : (e.touches ? e.touches[0].clientY : 'N/A'),
        time: new Date().toLocaleTimeString()
      });
    }, true);
  });
  
  // Track card clicks specifically
  document.querySelectorAll('.carousel-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const cardType = card.classList.contains('current-card') ? 'current' : 
                       card.classList.contains('prev-card') ? 'prev' : 
                       card.classList.contains('next-card') ? 'next' : 'unknown';
      
      console.log(`Card click detected:`, {
        day: card.dataset.day,
        type: cardType,
        target: e.target.tagName,
        path: e.composedPath().map(el => el.tagName || el.toString()).slice(0, 3).join(' > ')
      });
    });
  });
  
  console.log('Carousel event inspection enabled');
}

// Fix common carousel issues
function fixCarouselInteraction() {
  // Asegurar que las tarjetas tengan eventos de clic correctos
  document.querySelectorAll('.carousel-card').forEach(card => {
    // Eliminar cualquier estilo inline que pueda interferir
    card.style.pointerEvents = 'auto';
    
    // Añadir atributo data-fixed para seguimiento
    card.setAttribute('data-fixed', 'true');
    
    // Asegurar que cada tarjeta tenga un z-index apropiado
    if (card.classList.contains('current-card')) {
      card.style.zIndex = '10';
    } else {
      card.style.zIndex = '5';
    }
  });
  
  console.log('Applied carousel interaction fixes');
}

// Add mobile-specific debug function
window.debugMobile = function() {
  console.group('Mobile Debug');
  
  // Check if we're on a touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
  console.log(`Touch device: ${isTouchDevice}`);
  
  // Check if we have the right event listeners
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    console.log('Touch event listeners activated');
    
    // Temporarily listen to all touch events for debugging
    const touchLog = (e) => {
      console.log(`Touch event: ${e.type}`, {
        touches: e.touches.length,
        x: e.touches.length ? e.touches[0].clientX : 'none',
        target: e.target.tagName,
      });
    };
    
    carousel.addEventListener('touchstart', touchLog);
    carousel.addEventListener('touchmove', touchLog);
    carousel.addEventListener('touchend', touchLog);
    
    console.log('Debug touch listeners added - interact with carousel to see logs');
  }
  
  // Mobile card styles
  const cards = document.querySelectorAll('.carousel-card');
  cards.forEach(card => {
    const style = window.getComputedStyle(card);
    console.log(`Card ${card.dataset.day} mobile styles:`, {
      transition: style.transition,
      animation: style.animation,
      transform: style.transform,
      class: card.className
    });
  });
  
  console.groupEnd();
  
  // Add temporary visual indicators
  cards.forEach(card => {
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.top = '5px';
    indicator.style.right = '5px';
    indicator.style.background = 'red';
    indicator.style.color = 'white';
    indicator.style.padding = '2px 5px';
    indicator.style.borderRadius = '3px';
    indicator.style.fontSize = '10px';
    indicator.style.zIndex = '100';
    indicator.textContent = card.className.includes('current') ? 'C' : 
                            card.className.includes('prev') ? 'P' : 'N';
    
    card.appendChild(indicator);
    
    // Remove after 10 seconds
    setTimeout(() => indicator.remove(), 10000);
  });
  
  alert('Mobile debug activated. Check console for details.');
};

// Add click diagnostic function
window.testCardClicks = function() {
  console.group('Testing Card Click Functionality');
  
  // Test if cards are properly set up
  const cards = document.querySelectorAll('.carousel-card');
  console.log(`Found ${cards.length} carousel cards`);
  
  cards.forEach(card => {
    const day = card.dataset.day;
    const type = card.classList.contains('current-card') ? 'current' : 
                card.classList.contains('prev-card') ? 'prev' : 
                card.classList.contains('next-card') ? 'next' : 'unknown';
    
    // Check styles that could affect clickability
    const styles = window.getComputedStyle(card);
    console.log(`Card ${day} (${type}):`, {
      pointerEvents: styles.pointerEvents,
      zIndex: styles.zIndex,
      position: styles.position,
      opacity: styles.opacity,
      transform: styles.transform
    });
    
    // Add temporary visible click zone for testing
    const clickZone = document.createElement('div');
    clickZone.style.position = 'absolute';
    clickZone.style.top = '10px';
    clickZone.style.left = '50%';
    clickZone.style.transform = 'translateX(-50%)';
    clickZone.style.width = '80%';
    clickZone.style.height = '80%';
    clickZone.style.background = 'rgba(255,255,0,0.3)';
    clickZone.style.border = '2px dashed red';
    clickZone.style.zIndex = '100';
    clickZone.style.pointerEvents = 'none';
    clickZone.textContent = `Click test: Day ${day}`;
    clickZone.style.display = 'flex';
    clickZone.style.justifyContent = 'center';
    clickZone.style.alignItems = 'center';
    
    card.appendChild(clickZone);
    
    // Remove after 10 seconds
    setTimeout(() => clickZone.remove(), 10000);
    
    // Add direct click handler for testing
    card.dataset.originalClass = card.className;
    card.addEventListener('click', function(e) {
      console.log(`TEST - Direct click on ${type} card ${day}`);
      card.style.border = '3px solid lime';
      setTimeout(() => {
        card.style.border = '';
      }, 1000);
    });
  });
  
  console.log('Added test click handlers and visual indicators for 10 seconds');
  alert('Click test active! Try clicking cards and check console for results.');
  
  console.groupEnd();
};

// Add mobile debug button on touch devices - Won't run with debugMode = false
if ('ontouchstart' in window) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.debugMode) {
      // Button creation code will not execute since debugMode is false
    }
  });
}

// Add button to test clicks - Won't run with debugMode = false
document.addEventListener('DOMContentLoaded', function() {
  if (window.debugMode) {
    // Button creation code will not execute since debugMode is false
  }
});

// Initialize debugging tools once DOM is loaded - Won't run with debugMode = false
document.addEventListener('DOMContentLoaded', () => {
  if (window.debugMode) {
    // Button creation code will not execute since debugMode is false
  }
});

// Make functions available globally for console debugging
window.debugLog = debugLog;
window.inspectCarouselEvents = inspectCarouselEvents;
window.fixCarouselInteraction = fixCarouselInteraction;
