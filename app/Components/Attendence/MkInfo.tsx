import React, { useRef, useEffect } from "react";
import { MkData } from "./MkData";

interface MkInfoProps {
  mk: MkData | null;
  onClose: () => void;
}

const MkInfo: React.FC<MkInfoProps> = ({ mk, onClose }) => {
  const infoRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside the `mk-info` box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (mk) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mk, onClose]);

  if (!mk) return null; // Don't render if no MK is selected

  return (
    <div className="mk-info-overlay">
      <div className="mk-info" ref={infoRef}>
        <button className="mk-info-close" onClick={onClose}>
          ✖
        </button>
            <div className="mk-info-item">
                <img
                    src={mk.MkImage}
                    alt={mk.Name}
                    className={`mk-image ${mk.IsPresent ? "" : "grayscale"}`}
                />
                <div className="mk-name">{mk.Name}</div>
            </div>
        <p className="mk-info-detail"><strong>טלפון</strong> {mk.Phone}</p>
      </div>
    </div>
  );
};

export default MkInfo;
