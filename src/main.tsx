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
