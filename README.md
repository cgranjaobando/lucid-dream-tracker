# Lucid Dreams App

![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A web-based dream journal and lucidity training tool designed to guide users through a structured 30-day plan to achieve and enhance lucid dreaming skills.

## Overview

The Lucid Dreams App helps users track their dreams and improve their ability to achieve lucidity while dreaming. Through a progressive 30-day program, users are guided through various techniques and exercises specifically designed to enhance dream recall and lucidity.

## Features

- **Dual View Modes**
  - Interactive carousel view with smooth animations
  - Traditional grid calendar view for quick overview

- **30-Day Structured Plan**
  - Organized into 4 progressive phases
  - Each day features specific activities tailored to develop different aspects of lucid dreaming

- **Progress Tracking**
  - Mark activities as completed to track your progress
  - Visual progress bars for both daily and overall advancement

- **Detailed Instructions**
  - Brief descriptions for each technique
  - Expandable detailed instructions
  - Comprehensive explanations available in separate popups

- **User Experience**
  - Interactive carousel with swipe/touch support
  - Responsive design for both desktop and mobile
  - Local storage for persistent progress tracking

## Carousel View

The newly implemented carousel view features:

- **Three-Card Display**: Previous, current, and next day cards are visible simultaneously
- **Interactive Navigation**: Click side cards or use navigation buttons to move between days
- **Smooth Animations**: Professional transitions with choreographed z-index management
- **Multiple Navigation Options**: 
  - Dot indicators for visual reference
  - Numbered card navigation for direct access to any day
  - Arrow button controls
  - Touch/swipe gestures on mobile devices

## Recent Fixes

- Fixed scrollbar issues for cards with 2 or fewer activities
- Enhanced touch scrolling functionality for mobile devices
- Improved card visibility and interaction reliability
- Optimized animations for smoother transitions between days

## File Structure

LucidDreamsApp
├── src
│   ├── js
│   │   ├── utils.js           // Core functionality and data
│   │   ├── script.js          // Main application logic
│   │   ├── carousel.js        // Carousel implementation
│   │   └── debug.js           // Development debugging tools
│   ├── css
│   │   ├── style.css          // Main styles
│   │   ├── carousel.css       // Styles for the carousel view
│   │   └── popup.css          // Styles for popups
│   └── views
│       ├── grid.js            // Grid calendar view implementation
│       └── carousel.js        // Legacy view implementation (now forwards to main)
├── index.html                 // Main HTML file
└── README.md                  // This file

## Technical Details

The app is built with vanilla JavaScript, HTML, and CSS with no external dependencies:

- Responsive design for both desktop and mobile devices
- Event delegation for optimized performance
- CSS animations for smooth transitions
- Local Storage API for persistent user data
- Touch event handling for mobile devices
- Defensive programming techniques to ensure cross-browser compatibility

## Getting Started

1. Clone the repository or download the code.
2. Open `index.html` in any modern web browser.
3. Begin your lucid dreaming journey by following the daily activities.
4. Use the toggle button to switch between carousel and calendar views.
5. Click on any day to see detailed activities and mark them as completed.

## Browser Compatibility

- **Chrome/Edge (Desktop and Android)**: Full support
- **Firefox**: Full support
- **Safari (iOS)**: Full support
- **Android WebView**: Enhanced support with recent fixes

## Development Notes

- The carousel implementation uses a document fragment-based rendering approach for optimal performance.
- Activity lists conditionally display scrollbars only when content exceeds the visible area.
- Event propagation is carefully managed to avoid interaction conflicts.
- CSS variables are used for consistent animation timing and styling.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see LICENSE file for details.

Created by Carlos Granja (Powertrics)