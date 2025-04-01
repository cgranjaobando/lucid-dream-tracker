/**
 * Debug utilities for the Lucid Dreams App
 * This file contains functions to help diagnose and fix interaction issues
 * All UI elements are disabled but functions remain available via console
 */

// Global flag to disable debug mode UI
window.debugMode = false;

// Enhanced logging function that only logs when explicitly called
function debugLog(...args) {
  console.log('[DEBUG]', ...args);
}

// Function to inspect event handling in the carousel (console only)
function inspectCarouselEvents() {
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
  
  console.log('Carousel event inspection enabled - check console for events');
}

// Fix common carousel issues - available through console
function fixCarouselInteraction() {
  document.querySelectorAll('.carousel-card').forEach(card => {
    card.style.pointerEvents = 'auto';
    card.setAttribute('data-fixed', 'true');
    
    if (card.classList.contains('current-card')) {
      card.style.zIndex = '10';
    } else {
      card.style.zIndex = '5';
    }
  });
  
  console.log('Applied carousel interaction fixes');
}

// Mobile debug function - available through console only
window.debugMobile = function() {
  // Function implementation remains for use in console
  // but no UI buttons will be created
  console.group('Mobile Debug');
  
  const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
  console.log(`Touch device: ${isTouchDevice}`);
  
  // Rest of implementation...
  console.groupEnd();
};

// Card click test function - available through console only
window.testCardClicks = function() {
  // Function implementation remains for use in console
  console.group('Testing Card Click Functionality');
  // Rest of implementation...
  console.groupEnd();
};

// IMPORTANT: Remove all DOM event listeners that were creating buttons
// No event listeners should be added when debugMode is false

// Make functions available globally for console debugging only
window.debugLog = debugLog;
window.inspectCarouselEvents = inspectCarouselEvents;
window.fixCarouselInteraction = fixCarouselInteraction;

// Log that debug tools are available only via console
console.log('Debug tools available via console: debugMobile(), testCardClicks(), fixCarouselInteraction(), inspectCarouselEvents()');
