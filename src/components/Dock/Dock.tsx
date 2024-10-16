import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./dock.css";
import { BiHomeAlt } from "react-icons/bi";
import { RiGalleryLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaDollyFlatbed } from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface DockItemProps {
  IconComponent: IconType;
  path: string;
  isHovered: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  iconSize: string;
}

const DockItem: React.FC<DockItemProps> = ({
  IconComponent,
  path,
  isHovered,
  isActive,
  onMouseEnter,
  onMouseLeave,
  iconSize,
}) => {
  const itemStyle = isHovered ? { transform: 'scale(1.25)', margin: '0 20px' } : {};

  return (
    <div 
      className={`dock-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
      style={itemStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link to={path} className="dock-item-link-wrap">
        <IconComponent size={iconSize} />
      </Link>
    </div>
  );
};

const Dock: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [iconSize, setIconSize] = useState<string>("24px");
  const location = useLocation();

  useEffect(() => {
    const updateIconSize = () => {
      if (window.innerWidth <= 400) {
        setIconSize("20px");
      } else if (window.innerWidth <= 600) {
        setIconSize("22px");
      } else {
        setIconSize("24px");
      }
    };

    updateIconSize();
    window.addEventListener("resize", updateIconSize);

    return () => window.removeEventListener("resize", updateIconSize);
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const icons = [
    { icon: BiHomeAlt, path: "/" },
    { icon: RiGalleryLine, path: "/photos" },
    { icon: FaDollyFlatbed, path: "/shop" },
    { icon: FaUsers, path: "/teams" },
    { icon: FaRegEnvelope, path: "/contact" },
  ];

  return (
    <div className="dock-container">
      <div className="dock">
        {icons.map((item, index) => (
          <DockItem
            key={index}
            IconComponent={item.icon}
            path={item.path}
            isHovered={index === hoveredIndex}
            isActive={location.pathname === item.path}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            iconSize={iconSize}
          />
        ))}
      </div>
    </div>
  );
};

export default Dock;