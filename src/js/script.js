// Main application script for Lucid Dreams App

document.addEventListener('DOMContentLoaded', function() {
  // Ensure all required data is loaded first
  if (typeof plan === 'undefined') {
    console.error('Plan data not loaded yet');
    return;
  }
  
  // Handle Chrome extension connection error
  window.addEventListener('error', function(event) {
    // Suppress the "Receiving end does not exist" error from Chrome extensions
    if (event && event.message && 
        event.message.indexOf('Receiving end does not exist') !== -1) {
      event.stopPropagation();
      event.preventDefault();
    }
  });

  // Alternatively, catch it directly with unhandledrejection
  window.addEventListener('unhandledrejection', function(event) {
    if (event && event.reason && 
        event.reason.message && 
        event.reason.message.indexOf('Could not establish connection') !== -1) {
      event.preventDefault();
      console.log('Suppressed Chrome extension connection error');
    }
  });
  
  // DOM elements
  const toggleViewBtn = document.getElementById('toggleView');
  const carouselView = document.getElementById('carouselView');
  const gridView = document.getElementById('gridView');
  
  // View state
  let currentView = 'carousel'; // Default view
  
  // Initialize grid view if not already available
  if (typeof window.initializeGridView !== 'function') {
    window.initializeGridView = function() {
      const calendar = document.getElementById('calendar');
      if (!calendar) return;
      
      // Clear existing content
      calendar.innerHTML = '';
      
      // Create calendar day cards
      plan.forEach((activities, i) => {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day');
        dayBox.dataset.day = i + 1;
        dayBox.dataset.activities = JSON.stringify(activities);
        
        // Check saved state for completion
        const savedStates = JSON.parse(localStorage.getItem(`day-${i + 1}-tasks`)) || [];
        const isCompleted = savedStates.length > 0 && savedStates.every(state => state === true);
        
        if (isCompleted) {
          dayBox.classList.add('completed');
        }
        
        dayBox.innerHTML = `<strong>Día ${i + 1}</strong><br><small>${activities.join(', ')}</small>`;
        dayBox.addEventListener('click', function() {
          window.showDayPopup(this);
        });
        calendar.appendChild(dayBox);
      });
      
      // Update overall progress
      if (typeof window.updateOverallProgress === 'function') {
        window.updateOverallProgress();
      }
    };
  }
  
  // Add event listener for view toggle button
  toggleViewBtn.addEventListener('click', toggleView);
  
  // Initialize both views
  initializeViews();
  
  // Restore user's preferred view
  restorePreferredView();
  
  // Function to toggle between grid and carousel views
  function toggleView() {
    if (currentView === 'carousel') {
      // Switch to grid view
      carouselView.classList.add('hidden');
      gridView.classList.add('visible');
      toggleViewBtn.textContent = 'Cambiar a Vista de Carrusel';
      currentView = 'grid';
      
      // Ensure progress bar visibility in grid view
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.classList.remove('hidden');
      }
    } else {
      // Switch to carousel view
      gridView.classList.remove('visible');
      carouselView.classList.remove('hidden');
      toggleViewBtn.textContent = 'Cambiar a Vista de Calendario';
      currentView = 'carousel';
      
      // Ensure progress bar visibility in carousel view
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.classList.remove('hidden');
      }
    }
    
    // Save user preference
    localStorage.setItem('preferredView', currentView);
  }
  
  // Function to initialize both views
  function initializeViews() {
    // Create a shared progress bar that's visible in both views
    createSharedProgressBar();
    
    // Initialize grid view (calendar)
    if (typeof window.initializeGridView === 'function') {
      window.initializeGridView();
    } else {
      console.warn('Grid view initialization function not available yet');
    }
    
    // Improved carousel initialization with more robust error handling
    function tryInitCarousel(attempts = 0) {
      console.log(`Attempting carousel initialization, attempt ${attempts + 1}`);
      
      if (typeof window.initializeCarousel === 'function') {
        try {
          // Clear existing content first in case of partial initialization
          const carousel = document.querySelector('.carousel');
          if (carousel) carousel.innerHTML = '';
          
          window.initializeCarousel();
          
          // Verify initialization worked
          setTimeout(() => {
            const cards = document.querySelectorAll('.carousel-card');
            if (cards.length === 0 && attempts < 5) {
              console.warn('Carousel initialization did not create any cards, retrying...');
              tryInitCarousel(attempts + 1);
            } else if (cards.length > 0) {
              console.log(`Carousel successfully initialized with ${cards.length} cards`);
            }
          }, 200);
        } catch (error) {
          console.error('Error during carousel initialization:', error);
          if (attempts < 5) setTimeout(() => tryInitCarousel(attempts + 1), 300);
        }
      } else if (attempts < 5) {
        console.warn('Carousel initialization function not available yet, retrying...');
        setTimeout(() => tryInitCarousel(attempts + 1), 300);
      } else {
        console.error('Failed to initialize carousel after multiple attempts');
      }
    }
    
    tryInitCarousel();
    
    // Update overall progress
    if (typeof window.updateOverallProgress === 'function') {
      window.updateOverallProgress();
    }
  }
  
  // Create a shared progress bar outside of both views
  function createSharedProgressBar() {
    // Check if progress bar already exists
    if (!document.querySelector('.progress-bar')) {
      const main = document.querySelector('main');
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      progressBar.innerHTML = '<div id="progressFill" class="progress-fill"></div>';
      
      // Insert before the first child of main
      if (main && main.firstChild) {
        main.insertBefore(progressBar, main.firstChild);
      }
    }
  }
  
  // Restore user's preferred view from localStorage
  function restorePreferredView() {
    const preferredView = localStorage.getItem('preferredView');
    if (preferredView === 'grid' && currentView !== 'grid') {
      // Apply classes directly if grid is preferred
      carouselView.classList.add('hidden');
      gridView.classList.add('visible');
      toggleViewBtn.textContent = 'Cambiar a Vista de Carrusel';
      currentView = 'grid';
    } else {
      // Ensure carousel view is visible by default
      gridView.classList.remove('visible');
      carouselView.classList.remove('hidden');
    }
  }
});

// Add event listener to track all clicks for debugging
window.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    // Log all clicks to see if they're properly propagating
    const target = e.target;
    
    if (target.closest('.carousel-card')) {
      const card = target.closest('.carousel-card');
      const isProcessed = e.cardClickProcessed || false;
      
      console.log(`Click on carousel card detected:`, {
        day: card.dataset.day,
        class: Array.from(card.classList).join(' '),
        processed: isProcessed,
        target: target.tagName,
        clickPath: e.composedPath().map(el => el.tagName || el.toString()).join(' > ')
      });
    }
  }, true); // Use capture phase
});

// Function to show the day popup when a day card is clicked (either in grid or carousel)
window.showDayPopup = function(dayCard) {
  // Store reference to selected card for later
  window.selectedDayCard = dayCard;
  
  // Get popup elements
  const popup = document.getElementById('popup');
  const title = document.getElementById('popupTitle');
  const desc = document.getElementById('popupDesc');
  
  // Ensure we have valid activity data
  let activityKeys;
  try {
    activityKeys = JSON.parse(dayCard.dataset.activities);
    if (!Array.isArray(activityKeys)) {
      console.error('Invalid activity data format');
      return;
    }
  } catch (error) {
    console.error('Error parsing activity data:', error);
    return;
  }
  
  // Build popup content
  title.innerHTML = `Día ${dayCard.dataset.day}`;
  desc.innerHTML = activityKeys
    .map((key, index) => `
      <div style="margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center;">
          <input type="checkbox" class="task-checkbox" data-task="${key}" onchange="window.updateTaskProgress()">
          <strong class="activity-name" onclick="window.openActivityPopup('${key}')">${key}</strong>
        </div>
        <small>${activities[key]}</small>
        <span class="instruction-toggle" onclick="window.toggleInstructionDetail('${key}', ${index})">Ver más</span>
        <div id="instructionDetail_${key}_${index}" class="instruction-detail" style="display: none;"></div>
      </div>
    `).join('');
  
  // Load saved checkbox states
  const day = dayCard.dataset.day;
  const savedStates = JSON.parse(localStorage.getItem(`day-${day}-tasks`)) || [];
  const checkboxes = document.querySelectorAll('.task-checkbox');
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = savedStates[index] || false;
  });
  
  // Update progress if function exists
  if (typeof window.updateTaskProgress === 'function') {
    window.updateTaskProgress();
  }
  
  // Show popup
  popup.classList.add('active');
  
  // Debug info
  console.log(`Showing popup for day ${day}`);
  console.log(`Popup shown for day ${day} from ${dayCard.classList.contains('current-card') ? 'current' : 
    dayCard.classList.contains('prev-card') ? 'prev' : 
    dayCard.classList.contains('next-card') ? 'next' : 'unknown'} card`);
};

// Ensure navigateToSlide is globally accessible 
window.navigateToSlide = function(slideIndex) {
  if (typeof window.goToSlide === 'function') {
    window.goToSlide(slideIndex);
  } else if (typeof window.initializeCarousel === 'function') {
    // If carousel is initialized but goToSlide isn't available
    window.initializeCarousel();
    setTimeout(() => {
      if (typeof window.goToSlide === 'function') {
        window.goToSlide(slideIndex);
      }
    }, 100);
  }
};

// Add a global helper to diagnose card issues
window.debugCarousel = function() {
  console.group('Carousel Debug');
  
  const carousel = document.querySelector('.carousel');
  const cards = document.querySelectorAll('.carousel-card');
  
  console.log(`Carousel found: ${!!carousel}`);
  console.log(`Card count: ${cards.length}`);
  
  cards.forEach(card => {
    const classList = Array.from(card.classList);
    const day = card.dataset.day;
    const computed = window.getComputedStyle(card);
    
    console.log(`Card ${day}: ${classList.join(' ')}`);
    console.log(`  - Position: left=${computed.left}, right=${computed.right}, z-index=${computed.zIndex}`);
    console.log(`  - Visibility: opacity=${computed.opacity}, display=${computed.display}, visibility=${computed.visibility}`);
    console.log(`  - Transforms: ${computed.transform}`);
    console.log(`  - Pointer events: ${computed.pointerEvents}`);
  });
  
  console.groupEnd();
};
