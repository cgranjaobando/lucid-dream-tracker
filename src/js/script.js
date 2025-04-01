// Main application script for Lucid Dreams App

document.addEventListener('DOMContentLoaded', function() {
  // Ensure all required data is loaded first
  if (typeof plan === 'undefined') {
    console.error('Plan data not loaded yet');
    return;
  }
  
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
      carouselView.style.display = 'none';
      gridView.style.display = 'block';
      toggleViewBtn.textContent = 'Cambiar a Vista de Carrusel';
      currentView = 'grid';
      
      // Ensure progress bar visibility in grid view
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.display = 'block';
      }
    } else {
      // Switch to carousel view
      gridView.style.display = 'none';
      carouselView.style.display = 'block';
      toggleViewBtn.textContent = 'Cambiar a Vista de Calendario';
      currentView = 'carousel';
      
      // Ensure progress bar visibility in carousel view
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.display = 'block';
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
    
    // Initialize carousel view
    if (typeof window.initializeCarousel === 'function') {
      window.initializeCarousel();
    } else {
      console.warn('Carousel initialization function not available yet');
      // Try again after a short delay
      setTimeout(() => {
        if (typeof window.initializeCarousel === 'function') {
          window.initializeCarousel();
        }
      }, 200);
    }
    
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
      toggleView(); // Switch to grid view
    }
  }
});

// Function to show the day popup when a day card is clicked (either in grid or carousel)
window.showDayPopup = function(dayCard) {
  window.selectedDayCard = dayCard;
  const popup = document.getElementById('popup');
  const title = document.getElementById('popupTitle');
  const desc = document.getElementById('popupDesc');
  const activityKeys = JSON.parse(dayCard.dataset.activities);
  
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
  
  if (typeof window.updateTaskProgress === 'function') {
    window.updateTaskProgress();
  }
  popup.classList.add('active');
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
