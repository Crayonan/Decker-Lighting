import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Tag as PayloadGeneratedTag } from "@/types/payload-types";

interface ModalPhoto {
  id?: number;
  modalUrl: string; 
  tags: PayloadGeneratedTag[]; 
  width?: number | null;
  height?: number | null;
  description?: string;
}

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: ModalPhoto | null;
  photos: ModalPhoto[];
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
  const modalRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentPhoto) {
      setIsLoading(true);
    }
  }, [currentPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (photos.length > 0) {
        if (e.key === "ArrowRight") onNext();
        if (e.key === "ArrowLeft") onPrevious();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNext, onPrevious, photos.length]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length > 0) {
      setTouchStart(e.targetTouches[0].clientX);
      setTouchEnd(null);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length > 0) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || photos.length === 0) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrevious();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!isOpen) return null;

  const currentIndex = currentPhoto && photos.length > 0
    ? photos.findIndex((photo) => photo.id === currentPhoto.id || photo.modalUrl === currentPhoto.modalUrl)
    : -1;
  const totalPhotos = photos.length;

  return (
    <div
      className="fixed inset-0 select-none bg-black/90 touch-pan-y"
      style={{ zIndex: 100001 }}
      ref={modalRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => setIsNavigationVisible(prev => !prev)}
    >
      <div
        className={`transition-opacity duration-300 ${
          isNavigationVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 100002 }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute p-3 text-white transition-colors rounded-full top-4 right-4 bg-black/50 hover:bg-black/70 md:top-6 md:right-6"
          style={{ zIndex: 100003 }}
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>

        {totalPhotos > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
              className="absolute p-3 text-white transition-colors -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70 md:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute p-3 text-white transition-colors -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70 md:right-6"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        {totalPhotos > 0 && (
          <div
            className="absolute px-4 py-2 text-sm text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-black/50 md:text-base"
            style={{ zIndex: 100003 }}
          >
            {currentIndex !== -1 ? `${currentIndex + 1} / ${totalPhotos}` : ""}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center w-full h-full p-4" onClick={(e) => e.stopPropagation()}>
        {isLoading && currentPhoto && currentPhoto.modalUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}
        {currentPhoto && currentPhoto.modalUrl && (
          <img
            src={currentPhoto.modalUrl}
            alt={currentPhoto.description || "Gallery image"}
            className={`max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              console.error("Error loading image in modal:", currentPhoto.modalUrl);
              setIsLoading(false);
            }}
          />
        )}
        {(!currentPhoto || !currentPhoto.modalUrl) && !isLoading && (
            <p className="text-white">No photo to display or URL missing.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;