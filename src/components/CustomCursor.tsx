import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const mousePos = useRef({ x: -100, y: -100 });
  const outlinePos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isPressed = useRef(false);

  const updateDot = useCallback(() => {
    const dot = dotRef.current;
    if (!dot) return;
    dot.style.left = `${mousePos.current.x}px`;
    dot.style.top = `${mousePos.current.y}px`;
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      updateDot();
    };

    const handleMouseDown = () => {
      isPressed.current = true;
      dot.classList.add("cursor-pressed");
      outline.classList.add("outline-pressed");
    };

    const handleMouseUp = () => {
      isPressed.current = false;
      dot.classList.remove("cursor-pressed");
      outline.classList.remove("outline-pressed");
    };

    const handleMouseEnterLink = () => {
      isHovering.current = true;
      dot.classList.add("cursor-hover");
      outline.classList.add("outline-hover");
    };

    const handleMouseLeaveLink = () => {
      isHovering.current = false;
      dot.classList.remove("cursor-hover");
      outline.classList.remove("outline-hover");
    };

    const handleMouseLeaveWindow = () => {
      dot.style.opacity = "0";
      outline.style.opacity = "0";
    };

    const handleMouseEnterWindow = () => {
      dot.style.opacity = "1";
      outline.style.opacity = "1";
    };

    // Smooth outline following with RAF
    let animationId: number;
    const animate = () => {
      outlinePos.current.x += (mousePos.current.x - outlinePos.current.x) * 0.15;
      outlinePos.current.y += (mousePos.current.y - outlinePos.current.y) * 0.15;
      outline.style.left = `${outlinePos.current.x}px`;
      outline.style.top = `${outlinePos.current.y}px`;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    // Attach hover listeners to interactive elements
    const attachListeners = () => {
      const els = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, .cursor-pointer, .cursor-zoom-in"
      );
      els.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnterLink);
        el.addEventListener("mouseleave", handleMouseLeaveLink);
      });
      return els;
    };

    let elements = attachListeners();

    // Re-attach on DOM mutations (debounced)
    let mutationTimeout: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        elements.forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnterLink);
          el.removeEventListener("mouseleave", handleMouseLeaveLink);
        });
        elements = attachListeners();
      }, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(mutationTimeout);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
      observer.disconnect();
    };
  }, [isMobile, updateDot]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
      />
      <div
        ref={outlineRef}
        className="cursor-outline"
      />
    </>
  );
};

export default CustomCursor;
