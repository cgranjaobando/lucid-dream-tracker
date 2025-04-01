// This file contains the logic for the standard grid view of the application.

/**
 * Grid View Controller
 * Handles the calendar grid display and interactions
 */

// Function to initialize the grid view
function initializeGridView() {
  const calendar = document.getElementById('calendar');
  if (!calendar) return;
  
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
      dayBox.addEventListener('click', () => window.showDayPopup(dayBox));
      calendar.appendChild(dayBox);
    });
  }
  
  // Update progress
  if (typeof window.updateOverallProgress === 'function') {
    window.updateOverallProgress();
  }
}

// Make function available globally
window.initializeGridView = initializeGridView;