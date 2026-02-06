import { useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface ImageLightboxProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

const ImageLightbox = ({ imageUrl, title, onClose }: ImageLightboxProps) => {
  const [zoomed, setZoomed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(!zoomed);
          }}
          className="p-2 rounded-full bg-background/20 hover:bg-background/40 text-white transition-colors"
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
        >
          {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-background/20 hover:bg-background/40 text-white transition-colors"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>
      </div>

      {/* Title */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
          {title}
        </p>
      </div>

      {/* Image */}
      <div
        className={`transition-transform duration-500 ease-out ${
          zoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed(!zoomed);
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        />
      </div>
    </div>
  );
};

export default ImageLightbox;
