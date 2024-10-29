import React, { useState, useRef } from "react";
import { client } from "../../contentfulClient";
import "./photos.css";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import PhotoModal from "@/components/Photos/PhotoModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Photo {
  url: string;
  tags: string[];
  width?: number;
  height?: number;
}

const Photos: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading] = useState(true);

  const container = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(() => {
    if (!loading) {
      tagsRef.current.forEach((tag) => {
        if (tag) {
          gsap.to(tag, {
            scale: 1.05,
            duration: 0.3,
            paused: true,
            ease: "power1.out"
          });
        }
      });
    }
  }, { scope: container, dependencies: [loading] });


  // Query for tags
  const { data: tags = ["All"] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await client.getTags();
      const fetchedTags = response.items.map(tag => tag.sys.id);
      return ["All", ...fetchedTags];
    },
    staleTime: 1000 * 60 * 60,
  });

  // Query for photos
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos', selectedTag],
    queryFn: async () => {
      const query: Record<string, unknown> = {
        order: '-sys.createdAt',
        'metadata.tags[exists]': true,
        include: 10
      };

      if (selectedTag && selectedTag !== "All") {
        query['metadata.tags.sys.id[in]'] = selectedTag;
      }

      const response = await client.getAssets(query);
      return response.items
        .filter(asset => asset.metadata.tags.length > 0)
        .map(asset => ({
          url: `https:${asset.fields.file?.url.split('?')[0]}`,
          tags: asset.metadata.tags.map(tag => tag.sys.id),
          width: asset.fields.file?.details?.image?.width,
          height: asset.fields.file?.details?.image?.height,
        }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
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
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Distribute photos across columns
  const columnOne: Photo[] = [];
  const columnTwo: Photo[] = [];
  const columnThree: Photo[] = [];

  photos.forEach((photo, index) => {
    if (index % 3 === 0) columnOne.push(photo);
    else if (index % 3 === 1) columnTwo.push(photo);
    else columnThree.push(photo);
  });

  if (isLoading) {
    return (
      <div className="container p-4 mx-auto space-y-4">
        <nav className="flex flex-col md:flex-row justify-center mb-6 space-y-2 md:space-y-0 md:space-x-2">
          {["All", "Weddings", "Venues", "Festivals"].map((item) => (
            <Skeleton key={item} className="w-full md:w-24 h-10 rounded-full" />
          ))}
        </nav>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <Skeleton className="aspect-[3/4] w-full rounded-lg hidden md:block" />
          <Skeleton className="aspect-[3/4] w-full rounded-lg hidden lg:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Scrollable tags bar */}
      <div className="tags-bar-wrapper">
        <div className="tags-bar">
          {tags.map((tag, index) => (
            <button
              key={tag}
              ref={el => (tagsRef.current[index] = el)}
              className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
              onMouseEnter={() => handleTagHoverEnter(index)}
              onMouseLeave={() => handleTagHoverLeave(index)}
            >
              {capitalizeFirstLetter(tag)}
            </button>
          ))}
        </div>
      </div>

      {/* Photos grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[columnOne, columnTwo, columnThree].map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {column.map((photo, index) => {
              const actualIndex = columnIndex * Math.ceil(photos.length / 3) + index;
              return (
                <div 
                  key={index}
                  className="relative overflow-hidden rounded-lg"
                  style={{
                    aspectRatio: photo.width && photo.height 
                      ? `${photo.width}/${photo.height}`
                      : '3/4'
                  }}
                >
                  <img 
                    src={photo.url}
                    alt={`Photo ${actualIndex + 1}`}
                    onClick={() => handleImageClick(actualIndex)}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    loading={actualIndex < 9 ? "eager" : "lazy"}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

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