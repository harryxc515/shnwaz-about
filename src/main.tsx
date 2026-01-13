import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Console message for curious developers
console.log(
  "%c🔥 GO TO HELL 🔥",
  "color: #e11d48; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px #000;"
);
console.log(
  "%cNice try! This source code is protected by SHNWAZX. 😈",
  "color: #fff; font-size: 16px; background: #0a0a0a; padding: 10px; border-radius: 5px;"
);

// Disable right-click context menu
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  console.log("%c🚫 Right-click disabled!", "color: #e11d48; font-size: 14px;");
});

// Disable text selection and copying
document.addEventListener("selectstart", (e) => {
  e.preventDefault();
  return false;
});

document.addEventListener("copy", (e) => {
  e.preventDefault();
  console.log("%c🚫 Copying disabled! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
  return false;
});

// Disable drag
document.addEventListener("dragstart", (e) => {
  e.preventDefault();
  return false;
});

// Disable keyboard shortcuts (Ctrl+U, F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
document.addEventListener("keydown", (e) => {
  // F12
  if (e.key === "F12") {
    e.preventDefault();
    console.log("%c🚫 F12 disabled! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
    return false;
  }
  // Ctrl+U (View Source)
  if (e.ctrlKey && e.key === "u") {
    e.preventDefault();
    console.log("%c🚫 View Source disabled! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
    return false;
  }
  // Ctrl+Shift+I (DevTools)
  if (e.ctrlKey && e.shiftKey && e.key === "I") {
    e.preventDefault();
    console.log("%c🚫 DevTools disabled! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
    return false;
  }
  // Ctrl+Shift+J (Console)
  if (e.ctrlKey && e.shiftKey && e.key === "J") {
    e.preventDefault();
    console.log("%c🚫 Console disabled! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
    return false;
  }
  // Ctrl+Shift+C (Inspect Element)
  if (e.ctrlKey && e.shiftKey && e.key === "C") {
    e.preventDefault();
    console.log("%c🚫 Inspect disabled! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
    return false;
  }
  // Print Screen detection - show watermark
  if (e.key === "PrintScreen") {
    e.preventDefault();
    showScreenshotWatermark();
    console.log("%c📸 Screenshot detected! GO TO HELL 🔥", "color: #e11d48; font-size: 14px;");
    return false;
  }
});

// Create and show screenshot watermark overlay
const createWatermarkOverlay = () => {
  const overlay = document.createElement("div");
  overlay.id = "screenshot-watermark";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(10, 10, 10, 0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s ease;
  `;
  
  overlay.innerHTML = `
    <div style="text-align: center; color: #e11d48;">
      <div style="font-size: 72px; font-weight: bold; text-shadow: 0 0 30px rgba(225, 29, 72, 0.5);">🔥 GO TO HELL 🔥</div>
      <div style="font-size: 32px; margin-top: 20px; color: white;">PROTECTED BY SHNWAZX</div>
      <div style="font-size: 18px; margin-top: 10px; color: #888;">Screenshots are not allowed! 📸🚫</div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  return overlay;
};

let watermarkOverlay: HTMLElement | null = null;

const showScreenshotWatermark = () => {
  if (!watermarkOverlay) {
    watermarkOverlay = createWatermarkOverlay();
  }
  watermarkOverlay.style.opacity = "1";
  watermarkOverlay.style.pointerEvents = "all";
  
  setTimeout(() => {
    if (watermarkOverlay) {
      watermarkOverlay.style.opacity = "0";
      watermarkOverlay.style.pointerEvents = "none";
    }
  }, 2000);
};

// Detect visibility change (potential screenshot on mobile)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    showScreenshotWatermark();
  }
});

// Detect window blur (potential screenshot tool)
window.addEventListener("blur", () => {
  showScreenshotWatermark();
});

// Detect DevTools opening
const devToolsWarning = () => {
  const threshold = 160;
  if (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  ) {
    console.clear();
    console.log(
      "%c⚠️ GO TO HELL ⚠️",
      "color: #e11d48; font-size: 72px; font-weight: bold;"
    );
    console.log(
      "%cYou're not supposed to be here! 👀",
      "color: #fff; font-size: 20px;"
    );
  }
};

window.addEventListener("resize", devToolsWarning);
devToolsWarning();

createRoot(document.getElementById("root")!).render(<App />);
