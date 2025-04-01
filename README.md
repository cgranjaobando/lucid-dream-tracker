# Lucid Dreams App

## Overview
The Lucid Dreams App is designed to help users track their dreams and improve their ability to achieve lucidity while dreaming. The application provides various activities and techniques to enhance dream recall and lucidity.

## Features
- **Day Plan**: A structured 30-day plan that guides users through different activities aimed at improving dream awareness and lucidity.
- **Activity Data**: Detailed descriptions and instructions for each activity, helping users understand and implement techniques effectively.
- **Popup Management**: Interactive popups that provide additional information about activities and allow users to track their progress.

## New View Mode
The application now includes a new carousel view mode, which features:
- **Infinite Carousel**: Displays three portrait-oriented day cards at a time, allowing users to easily navigate through their daily activities.
- **Stylized Dots**: Visual indicators for slide navigation, enhancing the user experience.
- **Smaller Squares Carousel**: A secondary carousel that represents each day, providing a quick overview of the entire 30-day plan.

## File Structure
```
lucid-dream-tracker
├── src
│   ├── js
│   │   ├── script.js          // Main application logic
│   │   ├── carousel.js        // Logic for the infinite carousel
│   │   └── utils.js           // Utility functions
│   ├── css
│   │   ├── style.css          // Main styles
│   │   ├── carousel.css       // Styles for the carousel view
│   │   └── popup.css          // Styles for popups
│   ├── views
│   │   ├── grid.js            // Logic for the grid view
│   │   └── carousel.js         // Logic for the carousel view
│   └── components
│       ├── day-card.js        // Component for day cards
│       ├── popup.js           // Component for popups
│       └── indicators.js       // Component for slide indicators
├── index.html                 // Main HTML file
├── README.md                  // Project documentation
└── .gitignore                 // Git ignore file
```

## Getting Started
To get started with the Lucid Dreams App, clone the repository and open `index.html` in your web browser. Follow the instructions provided within the app to begin your journey towards achieving lucidity in your dreams.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.