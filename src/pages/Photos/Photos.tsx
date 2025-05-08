import React, { useState, useRef, useMemo } from "react";
import { fetchPhotos, fetchPhotoTags } from "../../payloadClient";
import "./photos.css";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import PhotoModal from "@/components/Photos/PhotoModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import type { Photo as PayloadGeneratedPhoto, Tag as PayloadGeneratedTag, Media, MediaSizes } from "@/types/payload-types";

const PAYLOAD_PUBLIC_URL = import.meta.env.BACKEND_URL;

interface DisplayPhoto {
  id: number;
  gridUrl: string;
  modalUrl: string;
  rawUrl?: string | null;
  tags: PayloadGeneratedTag[];
  width?: number | null;
  height?: number | null;
  description?: string;  
}

interface UITag {
  id: number | undefined;
  name: string;
}

const Photos: React.FC = () => {
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const container = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const { data: fetchedTags, isLoading: isLoadingTags, error: tagsError } = useQuery<PayloadGeneratedTag[]>({
    queryKey: ['tags'],
    queryFn: fetchPhotoTags,
    staleTime: 1000 * 60 * 60,
  });

  const uiTags: UITag[] = useMemo(() => {
    const allTag: UITag = { id: undefined, name: "All" };
    if (!fetchedTags) return [allTag];
    return [allTag, ...fetchedTags.map(tag => ({ id: tag.id, name: tag.name || "Unnamed Tag" }))];
  }, [fetchedTags]);

  const { data: paginatedPhotos, isLoading: isLoadingPhotos, error: photosError } = useQuery({
    queryKey: ['photos', selectedTagId],
    queryFn: () => fetchPhotos(selectedTagId),
    staleTime: 1000 * 60 * 5,
  });

  const photos: DisplayPhoto[] = useMemo(() => {
    return paginatedPhotos?.docs.map((p: PayloadGeneratedPhoto) => {
      const imageField = p.image as Media;

      let mediaObject: Media | null = null;
      let originalRelativeUrl: string | undefined | null = undefined;
      let gridRelativeUrl: string | undefined | null = undefined;
      
      let modalDisplayUrl = '';
      let gridDisplayUrl = '';


      if (typeof imageField === 'object' && imageField !== null && 'url' in imageField) {
          mediaObject = imageField as Media;
          originalRelativeUrl = mediaObject?.url;

          const preferredGridSizeName: keyof MediaSizes = 'tablet'; 
          const gridSizeObject = mediaObject?.sizes?.[preferredGridSizeName];
          gridRelativeUrl = gridSizeObject?.url || originalRelativeUrl; 

      } else if (typeof imageField === 'number') {
           originalRelativeUrl = undefined;
           gridRelativeUrl = undefined;
      } else {
           originalRelativeUrl = undefined;
           gridRelativeUrl = undefined;
      }


      if (originalRelativeUrl && PAYLOAD_PUBLIC_URL) {
        const publicUrlBase = PAYLOAD_PUBLIC_URL.endsWith('/') ? PAYLOAD_PUBLIC_URL.slice(0, -1) : PAYLOAD_PUBLIC_URL;
        const imagePath = originalRelativeUrl.startsWith('/') ? originalRelativeUrl : `/${originalRelativeUrl}`;
        modalDisplayUrl = `${publicUrlBase}${imagePath}`;
      } else if (originalRelativeUrl) {
        modalDisplayUrl = originalRelativeUrl;
      }
      
      if (gridRelativeUrl && PAYLOAD_PUBLIC_URL) {
        const publicUrlBase = PAYLOAD_PUBLIC_URL.endsWith('/') ? PAYLOAD_PUBLIC_URL.slice(0, -1) : PAYLOAD_PUBLIC_URL;
        const imagePath = gridRelativeUrl.startsWith('/') ? gridRelativeUrl : `/${gridRelativeUrl}`;
        gridDisplayUrl = `${publicUrlBase}${imagePath}`;
      } else {
          if(modalDisplayUrl) gridDisplayUrl = modalDisplayUrl;
      }

      const populatedTags = (p.tags?.filter(tag => typeof tag === 'object' && tag !== null) as PayloadGeneratedTag[]) || [];

      return {
        id: p.id,
        gridUrl: gridDisplayUrl,
        modalUrl: modalDisplayUrl,
        rawUrl: originalRelativeUrl,
        tags: populatedTags,
        width: mediaObject?.width,
        height: mediaObject?.height,
        description: p.description || '',
      };
    }) || [];
  }, [paginatedPhotos]);

  useGSAP(() => {
    if (!isLoadingPhotos && !isLoadingTags) {
      tagsRef.current.forEach((tagEl) => {
        if (tagEl) {
          gsap.to(tagEl, { scale: 1.0, duration: 0.3, ease: "power1.out" });
        }
      });
    }
  }, { scope: container, dependencies: [isLoadingPhotos, isLoadingTags, uiTags] });

  const handleTagClick = (tagId: number | undefined) => {
    setSelectedTagId(tagId);
  };

  const handleTagHoverEnter = (index: number) => {
    if (tagsRef.current[index]) {
      gsap.to(tagsRef.current[index], { scale: 1.05, duration: 0.3, ease: "power1.out" });
    }
  };

  const handleTagHoverLeave = (index: number) => {
    if (tagsRef.current[index]) {
      gsap.to(tagsRef.current[index], { scale: 1, duration: 0.3, ease: "power1.out" });
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  const handleNextPhoto = () => {
    if (photos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePreviousPhoto = () => {
    if (photos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const capitalizeFirstLetter = (string: string | undefined): string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const columnOne: DisplayPhoto[] = [];
  const columnTwo: DisplayPhoto[] = [];
  const columnThree: DisplayPhoto[] = [];

  photos.forEach((photo, index) => {
    if (index % 3 === 0) columnOne.push(photo);
    else if (index % 3 === 1) columnTwo.push(photo);
    else columnThree.push(photo);
  });

  if (isLoadingPhotos || isLoadingTags) {
    const skeletonTagItems: UITag[] = uiTags.length > 1 && !isLoadingTags
      ? uiTags
      : [
          { id: undefined, name: 'All' },
          { id: 1, name: 'Laden...' },
          { id: 2, name: 'Laden...' },
        ];
    return (
      <div className="container p-4 mx-auto space-y-4">
        <nav className="tags-bar-wrapper">
          <div className="tags-bar">
            {skeletonTagItems.map((item) => (
              <Skeleton key={item.id?.toString() || 'all-skeleton'} className="w-24 h-10 mt-2 mr-2 rounded-full tag-btn" />
            ))}
          </div>
        </nav>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-[3/4] w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (tagsError || photosError) {
    return (
      <div className="container p-4 mx-auto">
        <p className="text-red-500">
          Error loading data:
          {tagsError && ` Tags Error: ${(tagsError as Error).message}`}
          {photosError && ` Photos Error: ${(photosError as Error).message}`}
        </p>
      </div>
    );
  }
  
  return (
    <div className="container px-4 mx-auto" ref={container}>
      <div className="tags-bar-wrapper">
        <div className="tags-bar">
          {uiTags.map((tag, index) => (
            <button
              key={tag.id?.toString() || 'all'}
              ref={el => {
                if (el) tagsRef.current[index] = el;
              }}
              className={`tag-btn ${selectedTagId === tag.id ? 'active' : ''}`}
              onClick={() => handleTagClick(tag.id)}
              onMouseEnter={() => handleTagHoverEnter(index)}
              onMouseLeave={() => handleTagHoverLeave(index)}
            >
              {capitalizeFirstLetter(tag.name)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[columnOne, columnTwo, columnThree].map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {column.map((photo, photoIndex) => {
              let actualIndex = 0;
              if (columnIndex === 0) actualIndex = photoIndex;
              else if (columnIndex === 1) actualIndex = columnOne.length + photoIndex;
              else actualIndex = columnOne.length + columnTwo.length + photoIndex;
              
              if (!photo.gridUrl) { 
                console.warn("Photo missing grid URL:", photo);
                return <Skeleton key={`${photo.id}-skeleton-${photoIndex}`} className="aspect-[3/4] w-full rounded-lg" />;
              }

              return (
                <div 
                  key={photo.id || `photo-${columnIndex}-${photoIndex}`}
                  className="relative overflow-hidden rounded-lg cursor-pointer"
                  style={{ aspectRatio: photo.width && photo.height ? `${photo.width}/${photo.height}` : '3/4' }}
                  onClick={() => handleImageClick(actualIndex)}
                >
                  <img 
                    src={photo.gridUrl}
                    alt={photo.description || `Gallery image ${actualIndex + 1}`}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    loading={actualIndex < 9 ? "eager" : "lazy"}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {photos.length === 0 && !isLoadingPhotos && (
        <div className="py-10 text-center text-dark-text-secondary">
            No photos found for the selected tag.
        </div>
      )}

      <PhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPhoto={photos[currentPhotoIndex]}
        photos={photos}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
      />
    </div>
  );
};

export default Photos;