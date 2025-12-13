import { useEffect, useState, useRef } from "react";

interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = "up" } = options;
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      const movement = distanceFromCenter * speed * (direction === "up" ? -1 : 1);
      setOffset(movement);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction]);

  return { ref, offset };
};

export const useContinuousScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [elementProgress, setElementProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how far through the viewport the element is
        const progress = 1 - (rect.top / windowHeight);
        setElementProgress(Math.max(0, Math.min(1, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, scrollY, elementProgress };
};
