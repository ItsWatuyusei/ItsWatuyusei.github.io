# Artisan Bakery Showcase

A premium, interactive product showcase and ordering system built with modern web standards, adhering to the **ItsWatuyusei** architectural rules. 

This project evolved from a simple showcase into a functional, production-ready "Light" e-commerce interface, enabling seamless product discovery and direct WhatsApp ordering.

## ✨ Key Features

- **Dynamic Shopping Cart**: A "Light" cart system allowing users to add multiple items, review their order, and send it directly via WhatsApp.
- **Flying Cart Animation**: Interactive micro-animation where product images "fly" to the cart icon upon addition for enhanced visual feedback.
- **Product Badges**: Visual indicators for "Bestseller", "New", and "Limited" items to drive conversion.
- **Image Slider Modal**: High-quality product details modal with an interactive image slider for multiple views.
- **Real-Time Currency Conversion**: Integrates with external APIs to dynamically fetch and display the official Bs. exchange rate alongside USD prices.
- **Multilingual Support**: Fully localized interface in **English** and **Spanish**, with robust language detection and smooth switching.
- **Modern UI & Soft Interactions**: 
  - Clean, premium design with HSL color palettes and Inter typography.
  - Interactive "Soft UI" features, including subtle Web Audio API sound effects for interactions.
  - Scroll-based progress bar and dynamic "Back to Top" functionality.
- **Dark/Light Mode**: Automatic theme switching based on system preferences with manual override options.
- **Search & Filter**: Real-time filtering by category (Sweet/Savory) and search query with automatic scroll-to-results.

## 📁 Project Structure

The project follows a clean, modular architecture:

- `index.html`: Semantic HTML5 structure serving as the single-page application entry point.
- `assets/css/styles.css`: Advanced CSS3 implementation featuring CSS variables (design tokens), animations, responsive queries, and theming.
- `assets/js/app.js`: Modular ES6 JavaScript handling application logic, cart state management, DOM manipulation, and animations.
- `assets/js/config.js`: Centralized Single Source of Truth (SSOT) configuration for products, translations, and global settings.
- `manifest.json`: Web app manifest for PWA support.

## 🚀 Deployment & Usage

Since the project is built using Vanilla HTML/CSS/JS, no complex build steps are required.

1. Clone or download the repository.
2. Serve the directory using any standard web server (e.g., Apache, Nginx, or VS Code Live Server).
3. Open `index.html` in any modern web browser to view the application.

*Note: The currency conversion feature requires an active internet connection to fetch the live rate.*

---
*Built with ❤️ for ItsWatuyusei Bakery*
