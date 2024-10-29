import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { client } from "../../contentfulClient";
import "./photos.css";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface Photo {
  url: string;
  tags: string[];
}

const Photos: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const container = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Query for tags
  const { data: tags = ["All"] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await client.getTags();
      const fetchedTags = response.items.map(tag => tag.sys.id);
      return ["All", ...fetchedTags];
    },
    staleTime: 1000 * 60 * 60, // Consider tags fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  // Query for photos
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos', selectedTag],
    queryFn: async () => {
      const query: Record<string, unknown> = {
        order: '-sys.createdAt',
        'metadata.tags[exists]': true
      };

      if (selectedTag && selectedTag !== "All") {
        query['metadata.tags.sys.id[in]'] = selectedTag;
      }

      const response = await client.getAssets(query);
      return response.items
        .filter(asset => asset.metadata.tags.length > 0)
        .map(asset => ({
          url: asset.fields.file?.url || '',
          tags: asset.metadata.tags.map(tag => tag.sys.id),
        }));
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  useGSAP(() => {
    if (!isLoading) {
      gsap.from(".photos-col img", { y: 300, stagger: 0.025, opacity: 0 });

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
  }, { scope: container, dependencies: [isLoading] });

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

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
        <nav className="flex justify-center mb-6 space-x-2">
          {["All", "Weddings", "Venues", "Festivals"].map((item) => (
            <Skeleton key={item} className="w-24 h-10 rounded-full" />
          ))}
        </nav>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="w-full rounded-lg aspect-square" />
            <Skeleton className="w-full rounded-lg aspect-square" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-photos" ref={container}>
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

      <div className="photos-grid">
        <div className="photos-col">
          {columnOne.map((photo, index) => (
            <img 
              key={index} 
              src={photo.url} 
              alt={`Photo ${index}`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="photos-col">
          {columnTwo.map((photo, index) => (
            <img 
              key={index} 
              src={photo.url} 
              alt={`Photo ${index}`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="photos-col">
          {columnThree.map((photo, index) => (
            <img 
              key={index} 
              src={photo.url} 
              alt={`Photo ${index}`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photos;
