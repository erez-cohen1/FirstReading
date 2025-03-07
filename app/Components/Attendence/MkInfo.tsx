import React, { useRef, useEffect } from "react";
import { MkData } from "./MkData";

interface MkInfoProps {
  mk: MkData | null;
  onClose: () => void;
}

const MkInfo: React.FC<MkInfoProps> = ({ mk, onClose }) => {
  const infoRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside the `mk-info` box OR when scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose(); // Close modal when user scrolls
    };

    if (mk) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mk, onClose]);

  if (!mk) return null; // Don't render if no MK is selected

  return (
    <div className="mk-info-overlay">
      <div className="mk-info" ref={infoRef}>
        <div className="mk-info-close" onClick={onClose}>
          ✖
        </div>
        <div className="mk-info-item">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "4.5rem" }}>
            <img
              src={mk.MkImage}
              alt={mk.Name}
              className={`mk-image ${mk.IsPresent ? "" : "grayscale"}`}
            />
            <div className="mk-name">{mk.Name}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <p className="mk-info-detail">{mk.Phone}</p>
            <p className="mk-info-detail">{mk.Mail}</p>
          </div>
        </div>

        {/* RolesList Section */}
        <div className="roles-list">
          {mk.RolesList.length > 0 ? (
            <div>
              {mk.RolesList.map((role, index) => (
                <p key={index}>{role}</p>
              ))}
            </div>
          ) : (
            <p>לחבר הכנסת אין תפקידים מיוחדים בכנסת</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MkInfo;
