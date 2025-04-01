/**
 * DEPRECATED - Functionality moved to src/js/carousel.js
 * This stub is maintained for backwards compatibility
 */

// Forward functions to the main implementation
function initializeCarouselView() {
  console.log("Using enhanced carousel implementation from src/js/carousel.js");
  if (typeof window.initializeCarousel === 'function') {
    window.initializeCarousel();
  } else {
    // Wait for the main implementation to load
    setTimeout(() => {
      if (typeof window.initializeCarousel === 'function') {
        window.initializeCarousel();
      } else {
        console.error("Main carousel implementation not found");
      }
    }, 300);
  }
}

// Register the function globally to maintain compatibility
window.initializeCarouselView = initializeCarouselView;

// Skip setupCarousel - the main implementation handles this
window.setupCarousel = function() {
  console.log("Using enhanced carousel setup from src/js/carousel.js");
};