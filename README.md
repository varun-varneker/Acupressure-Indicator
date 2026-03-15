# 🧘 Acupressure Body Explorer

A sleek, interactive web application designed to help users explore human acupressure points. Built with **React**, **Vite**, and **D3.js**, it offers a premium, glassmorphic UI with smooth zooming, real-time filtering, and full offline support (PWA).

## ✨ Key Features

*   **Interactive Body Maps**: High-quality SVG visualizations of both Front and Back body sides.
*   **Precision Zoom**: Click any coordinate to smoothly "swoop" it into the absolute center of your view.
*   **Smart Search**: Instantly filter points by name, symptom (e.g., "nausea"), meridian, or traditional Chinese names.
*   **Offline First (PWA)**: Installable to your home screen. Uses a Service Worker to cache all maps and data for offline use.
*   **Deep Medical Data**: Comprehensive details for each point, including anatomical locations, pressure techniques, benefits, and cautions.

## 🚀 How to Add This to Your Own App

Want to bring this body map into your own project? It's designed to be modular and "human-friendly." Here is how you can do it:

### 1. Grab the Essentials
You'll need to copy a few folders from this project into yours:
*   **Components**: Copy the `src/components/` folder. It contains the Map logic, the Sidebar, and the Search bar.
*   **Data**: Grab `src/data/points.js`. This is the "brain" that stores all the coordinates and medical info.
*   **Maps**: Move the two SVGs from the `public/` folder into your own `public/` folder.

### 2. Install the Panning Logic
This app uses **D3.js** to handle the smooth math of moving the map around. In your terminal, run:
```bash
npm install d3
```

### 3. Plug and Play
Inside your React code, you can now import the components. Your main file should look something like this:

```jsx
import BodyMap from './components/BodyMap';
import Sidebar from './components/Sidebar';
import { points } from './data/points';

// Use state to keep track of which point is being looked at!
```

### 🏮 A Few Tips for Success
*   **SVG Paths**: The map component looks for the body maps at your root `/` folder. If you put them in a subfolder like `/assets/`, just update the `fetch` URL in `BodyMap.jsx`.
*   **Styling**: We used a "Glassmorphism" theme. If you want to change the colors, check out the CSS variables in `src/index.css`!

---

*Made with ❤️ for Traditional Chinese Medicine & Modern Web Dev.*
