import React from "react";
import { Link } from "react-router-dom";

interface WorkItemProps {
  imgUrl?: string;
  containerHeight: number;
  workName: string;
  workDate: string;
  type: string;
  url?: string;
}

const WorkItem: React.FC<WorkItemProps> = ({
  imgUrl,
  containerHeight,
  workName,
  workDate,
  type,
  url,
}) => {
  const normalizedType = type.toLowerCase();

  return (
    <div className={`work-item type-${normalizedType}`}>
      <div className="work-item-img" style={{ height: `${containerHeight}px` }}>
        <div className="work-item-img-wrapper">
          <img src={imgUrl} alt={workName} />
        </div>

        <div className="work-item-info">
          <p id="work-name">{workName}</p>
          <p id="work-date">{workDate}</p>
        </div>
      </div>
      <div className="work-item-cta">
        {(normalizedType === "article" || normalizedType === "post") && url ? (
          <Link to={`/${normalizedType}/${url}`}>
            <button id="work-item-btn">
              {normalizedType === "post" ? "Read Post" : "View Article"}
            </button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default WorkItem;