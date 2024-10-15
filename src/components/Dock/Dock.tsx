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
  isNeighbor: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  external?: boolean;
  iconSize: string;
}

const DockItem: React.FC<DockItemProps> = ({
  IconComponent,
  path,
  isHovered,
  isNeighbor,
  isActive,
  onMouseEnter,
  external,
  iconSize,
}) => {
  const scale = isHovered ? 1.5 : isNeighbor ? 1.25 : 1;
  const margin = isHovered || isNeighbor ? "20px" : "6px";
  const linkStyle = { transform: `scale(${scale})`, margin: `0 ${margin}` };

  return (
    <div 
      className={`dock-item ${isActive ? 'active' : ''}`} 
      style={linkStyle} 
      onMouseEnter={onMouseEnter}
    >
      {external ? (
        <a href={path} target="_blank" rel="noopener noreferrer">
          <div className="dock-item-link-wrap">
            <IconComponent size={iconSize} style={{ color: isActive ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 50%)" }} />
          </div>
        </a>
      ) : (
        <Link to={path}>
          <div className="dock-item-link-wrap">
            <IconComponent size={iconSize} style={{ color: isActive ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 50%)" }} />
          </div>
        </Link>
      )}
    </div>
  );
};

const Dock: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [hoverEffectsEnabled, setHoverEffectsEnabled] = useState<boolean>(
    window.innerWidth >= 900
  );
  const [iconSize, setIconSize] = useState<string>(window.innerWidth < 900 ? "35px" : "30px");
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const isEnabled = window.innerWidth >= 900;
      const newSize = window.innerWidth < 900 ? "35px" : "30px";
      setHoverEffectsEnabled(isEnabled);
      setIconSize(newSize);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleMouseEnter = (index: number) => {
    if (hoverEffectsEnabled) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (hoverEffectsEnabled) {
      setTimeout(() => {
        setHoveredIndex(-100);
      }, 50);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setHoveredIndex(-100);
    }, 50);
  }, []);

  const icons = [
    { icon: BiHomeAlt, path: "/" },
    { icon: RiGalleryLine, path: "/photos" },
    { icon: FaDollyFlatbed, path: "/shop" },
    { icon: FaUsers, path: "/teams" },
    { icon: FaRegEnvelope, path: "/contact" },
  ];

  return (
    <div className="dock-container" onMouseLeave={handleMouseLeave}>
      <div className="dock">
        {icons.map((item, index) => (
          <DockItem
            key={index}
            IconComponent={item.icon}
            path={item.path}
            isHovered={index === hoveredIndex}
            isNeighbor={Math.abs(index - hoveredIndex) === 1}
            isActive={location.pathname === item.path}
            onMouseEnter={() => handleMouseEnter(index)}
            iconSize={iconSize}
          />
        ))}
      </div>
    </div>
  );
};

export default Dock;