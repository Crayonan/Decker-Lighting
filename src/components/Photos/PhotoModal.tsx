import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Photo {
  url: string;
  tags: string[];
  width?: number;
  height?: number;
}

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: Photo | null;
  photos: Photo[];
  onNext: () => void;
  onPrevious: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  photos,
  onNext,
  onPrevious,
}) => {
  const modalRef = useRef(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when photo changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Restore scrolling when modal is closed
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  // Handle touch events
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrevious();
    }
  };

  if (!isOpen) return null;

  const currentIndex = photos.findIndex(
    (photo) => photo.url === currentPhoto?.url
  );
  const totalPhotos = photos.length;

  return (
    <div
      className="fixed inset-0 bg-black/90 touch-none select-none"
      style={{ zIndex: 1000 }} // Ensure modal background is above everything
      ref={modalRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => setIsNavigationVisible(true)}
    >
      {/* Controls wrapper */}
      <div
        className={`transition-opacity duration-300 ${
          isNavigationVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 1100 }} // Controls above modal background
      >
        {/* Close button with highest z-index */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors md:top-6 md:right-6"
          style={{ zIndex: 1200 }} // Close button above everything
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors md:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors md:right-6"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Photo counter */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm md:text-base"
          style={{ zIndex: 1200 }}
        >
          {currentIndex + 1} / {totalPhotos}
        </div>
      </div>

      {/* Image container */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {currentPhoto && (
          <img
            src={currentPhoto.url}
            alt="Gallery"
            className={`max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsNavigationVisible(!isNavigationVisible);
            }}
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoModal;
