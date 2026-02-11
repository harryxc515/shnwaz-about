import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const handleMouseDown = () => {
      dot.style.transform = "translate(-50%, -50%) scale(0.6)";
      outline.style.transform = "translate(-50%, -50%) scale(0.8)";
    };

    const handleMouseUp = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      outline.style.transform = "translate(-50%, -50%) scale(1)";
    };

    const handleMouseEnterLink = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1.5)";
      outline.style.width = "50px";
      outline.style.height = "50px";
      outline.style.borderColor = "hsl(var(--primary))";
    };

    const handleMouseLeaveLink = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      outline.style.width = "36px";
      outline.style.height = "36px";
      outline.style.borderColor = "hsl(var(--foreground) / 0.5)";
    };

    // Animate outline following
    let animationId: number;
    const animate = () => {
      outlineX += (mouseX - outlineX) * 0.12;
      outlineY += (mouseY - outlineY) * 0.12;
      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add hover effect to all interactive elements
    const addLinkListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, [role='button'], input, textarea, select, .cursor-pointer, .cursor-zoom-in");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnterLink);
        el.addEventListener("mouseleave", handleMouseLeaveLink);
      });
      return interactiveElements;
    };

    let elements = addLinkListeners();

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
      elements = addLinkListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "hsl(var(--primary))",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.15s ease, width 0.15s ease, height 0.15s ease",
        }}
      />
      <div
        ref={outlineRef}
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          width: "36px",
          height: "36px",
          border: "2px solid hsl(var(--foreground) / 0.5)",
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, transform 0.15s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
