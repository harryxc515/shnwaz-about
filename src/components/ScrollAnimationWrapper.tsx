import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale";
  delay?: number;
  threshold?: number;
}

const ScrollAnimationWrapper = ({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: ScrollAnimationWrapperProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const hiddenClass = {
    "fade-up": "scroll-hidden",
    "fade-left": "scroll-hidden-left",
    "fade-right": "scroll-hidden-right",
    "scale": "scroll-hidden-scale",
  }[animation];

  const visibleClass = {
    "fade-up": "scroll-visible",
    "fade-left": "scroll-visible-x",
    "fade-right": "scroll-visible-x",
    "scale": "scroll-visible-scale",
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(hiddenClass, isVisible && visibleClass, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollAnimationWrapper;
