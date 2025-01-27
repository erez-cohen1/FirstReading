import React, {useState, useRef } from "react";
import { MkData } from "./MkData";

interface MemberCardProps {
  mk: MkData;
}

const MemberCard: React.FC<MemberCardProps> = ({ mk }) => {
    const [flippedId, setFlippedId] = useState<number | null>(null);
    
    const handleFlip = (id: number) => {
        setFlippedId(flippedId === id ? null : id); // Toggle the flip state
      };
      
  return (
    <div
        className={`grid-item ${flippedId === mk.MkId ? "flipped" : ""}`}
        key={mk.MkId}
        onClick={() => handleFlip(mk.MkId)}
    >
        {flippedId === mk.MkId ? (
        <div className="mk-info">
            <div className="mk-name">{mk.Name}</div>
            <div className="mk-name">{mk.FactionName}</div>
            <div className="mk-name">{mk.Phone}</div>
        </div>
        ) : (
          <>
            <img src={mk.MkImage} alt={mk.Name} className={`mk-image ${mk.IsPresent ? "" : "grayscale"}`} />
            <div className="mk-name">{mk.Name}</div>
          </>
        )}
    </div>
  );
};

export default MemberCard;
