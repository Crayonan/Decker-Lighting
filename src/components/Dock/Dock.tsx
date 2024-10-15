import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dock.css";
import { BiHomeAlt } from "react-icons/bi";
import { RiGalleryLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaDollyFlatbed } from "react-icons/fa";

interface DockItemProps {
  IconComponent: IconType;
  path: string;
  isHovered: boolean;
  isNeighbor: boolean;
  onMouseEnter: () => void;
  external?: boolean;
  iconSize: string;
}

const DockItem: React.FC<DockItemProps> = ({
  IconComponent,
  path,
  isHovered,
  isNeighbor,
  onMouseEnter,
  external,
  iconSize,
}) => {
  const scale = isHovered ? 2.5 : isNeighbor ? 2 : 1;
  const margin = isHovered || isNeighbor ? "28px" : "4px";
  const linkStyle = { transform: `scale(${scale})`, margin: `0 ${margin}` };

  return (
    <div className="dock-item" style={linkStyle} onMouseEnter={onMouseEnter}>
      {external ? (
        <a href={path} target="_blank" rel="noopener noreferrer">
          <div className="dock-item-link-wrap">
            <IconComponent size={iconSize} style={{ color: "hsl(0, 0%, 50%)" }} />
          </div>
        </a>
      ) : (
        <Link to={path}>
          <div className="dock-item-link-wrap">
            <IconComponent size={iconSize} style={{ color: "hsl(0, 0%, 50%)" }} />
          </div>
        </Link>
      )}
    </div>
  );
};

interface IconConfig {
  icon: IconType;
  path: string;
  external?: boolean;
}

const Dock: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [hoverEffectsEnabled, setHoverEffectsEnabled] = useState<boolean>(
    window.innerWidth >= 900
  );
  const [iconSize, setIconSize] = useState<string>(window.innerWidth < 900 ? "25px" : "20px");

  useEffect(() => {
    const checkScreenSize = () => {
      const isEnabled = window.innerWidth >= 900;
      const newSize = window.innerWidth < 900 ? "25px" : "20px";
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
    { icon: FaUsers, path: "/teams" },
    { icon: FaDollyFlatbed, path: "/shop" },
    { icon: RiGalleryLine, path: "/photos" },
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
            onMouseEnter={() => handleMouseEnter(index)}
            iconSize={iconSize}
          />
        ))}
      </div>
    </div>
  );
};

export default Dock;