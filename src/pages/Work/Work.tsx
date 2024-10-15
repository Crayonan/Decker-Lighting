import React, { useEffect, useState } from "react";
import { client } from "../../contentfulClient";
import WorkItem from "./WorkItem";
import "./work.css";

interface WorkFields {
  featuredImage?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  title: string;
  date: string;
  type: string;
  height: number;
  reference?: {
    fields: {
      slug: string;
    };
  };
}

interface WorkEntry {
  sys: {
    id: string;
  };
  fields: WorkFields;
}

const Work: React.FC = () => {
  const [works, setWorks] = useState<WorkEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    client
      .getEntries<WorkFields>({
        content_type: "work",
        include: 2,
      })
      .then((response) => {
        console.log('Fetched work items:', response.items);
        setWorks(response.items as WorkEntry[]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching work entries:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading works...</p>;
  }

  const columnOne = works.slice(0, Math.ceil(works.length / 3));
  const columnTwo = works.slice(Math.ceil(works.length / 3), Math.ceil(works.length * 2 / 3));
  const columnThree = works.slice(Math.ceil(works.length * 2 / 3), works.length);

  const renderWorkItems = (workItems: WorkEntry[]) => {
    return workItems.map((work) => {
      const { featuredImage, title, date, type, height, reference } = work.fields;
      const slug = reference?.fields?.slug;

      console.log(`Item: ${title}, Type: ${type}, Slug: ${slug}`);

      return (
        <WorkItem
          key={work.sys.id}
          imgUrl={featuredImage?.fields?.file.url}
          containerHeight={height}
          workName={title}
          workDate={new Date(date).toLocaleDateString()}
          type={type}
          url={slug}
        />
      );
    });
  };

  return (
    <div className="container page-work">
      <div className="col">{renderWorkItems(columnOne)}</div>
      <div className="col">{renderWorkItems(columnTwo)}</div>
      <div className="col">{renderWorkItems(columnThree)}</div>
    </div>
  );
};

export default Work;