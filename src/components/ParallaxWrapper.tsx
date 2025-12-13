import { ReactNode } from "react";
import { useContinuousScrollAnimation } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";

interface ParallaxWrapperProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  rotate?: boolean;
  scale?: boolean;
  fade?: boolean;
}

const ParallaxWrapper = ({
  children,
  className,
  speed = 0.3,
  direction = "up",
  rotate = false,
  scale = false,
  fade = false,
}: ParallaxWrapperProps) => {
  const { ref, elementProgress } = useContinuousScrollAnimation();

  const getTransform = () => {
    const movement = (elementProgress - 0.5) * 100 * speed;
    
    let transform = "";
    
    switch (direction) {
      case "up":
        transform = `translateY(${-movement}px)`;
        break;
      case "down":
        transform = `translateY(${movement}px)`;
        break;
      case "left":
        transform = `translateX(${-movement}px)`;
        break;
      case "right":
        transform = `translateX(${movement}px)`;
        break;
    }

    if (rotate) {
      transform += ` rotate(${(elementProgress - 0.5) * 10 * speed}deg)`;
    }

    if (scale) {
      const scaleValue = 0.9 + elementProgress * 0.2;
      transform += ` scale(${Math.min(1.1, Math.max(0.9, scaleValue))})`;
    }

    return transform;
  };

  const getOpacity = () => {
    if (!fade) return 1;
    // Fade in as element enters viewport
    if (elementProgress < 0.3) {
      return elementProgress / 0.3;
    }
    // Fade out as element leaves viewport
    if (elementProgress > 0.7) {
      return 1 - (elementProgress - 0.7) / 0.3;
    }
    return 1;
  };

  return (
    <div
      ref={ref}
      className={cn("transition-transform duration-100", className)}
      style={{
        transform: getTransform(),
        opacity: getOpacity(),
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxWrapper;
