// This file contains the logic for the standard grid view of the application.

/**
 * Grid View Controller
 * Handles the calendar grid display and interactions
 */

// Function to initialize the grid view
function initializeGridView() {
  const calendar = document.getElementById('calendar');
  if (!calendar) {
    console.error('Calendar element not found');
    return;
  }
  
  // Clear existing content
  calendar.innerHTML = '';
  
  // Create day cards for each day in the plan
  if (typeof plan !== 'undefined') {
    plan.forEach((activities, i) => {
      const dayBox = document.createElement('div');
      dayBox.classList.add('day');
      dayBox.dataset.day = i + 1;
      dayBox.dataset.activities = JSON.stringify(activities);
      
      // Check if day is completed based on saved data
      const savedStates = JSON.parse(localStorage.getItem(`day-${i + 1}-tasks`)) || [];
      const isCompleted = savedStates.length > 0 && savedStates.every(state => state === true);
      
      if (isCompleted) {
        dayBox.classList.add('completed');
      }
      
      dayBox.innerHTML = `<strong>Día ${i + 1}</strong><br><small>${activities.join(', ')}</small>`;
      
      // Add a more robust click handler
      dayBox.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Grid day ${i+1} clicked`);
        if (window.showDayPopup) {
          window.showDayPopup(this);
        } else {
          console.error('showDayPopup function not available');
        }
      });
      
      calendar.appendChild(dayBox);
    });
  } else {
    console.error('Plan data not defined');
  }
  
  // Update progress
  if (typeof window.updateOverallProgress === 'function') {
    window.updateOverallProgress();
  }
  
  console.log('Grid view initialized with', plan ? plan.length : 0, 'days');
}

// Make function available globally
window.initializeGridView = initializeGridView;