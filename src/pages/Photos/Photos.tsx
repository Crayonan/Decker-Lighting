import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { client } from "../../contentfulClient";
import "./photos.css";

interface Photo {
  url: string;
  tags: string[];
}

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [tags, setTags] = useState<string[]>(["All"]);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const container = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(() => {
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
  }, { scope: container });

  useEffect(() => {
    client.getTags()
      .then((response) => {
        const fetchedTags = response.items.map(tag => tag.sys.id);
        setTags(["All", ...fetchedTags]);
      })
      .catch(console.error);

    fetchAssets();
  }, []);

  const fetchAssets = (tag: string | null = null) => {
    const query: any = {
      order: '-sys.createdAt'
    };

    if (tag && tag !== "All") {
      query['metadata.tags.sys.id[in]'] = tag;
    }

    client.getAssets(query)
      .then((response) => {
        const assetItems = response.items.map(asset => ({
          url: asset.fields.file.url,
          tags: asset.metadata.tags.map(tag => tag.sys.id),
        }));
        setPhotos(assetItems);
      })
      .catch(console.error);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    fetchAssets(tag);
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
            <img key={index} src={photo.url} alt={`Photo ${index}`} />
          ))}
        </div>
        <div className="photos-col">
          {columnTwo.map((photo, index) => (
            <img key={index} src={photo.url} alt={`Photo ${index}`} />
          ))}
        </div>
        <div className="photos-col">
          {columnThree.map((photo, index) => (
            <img key={index} src={photo.url} alt={`Photo ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photos;