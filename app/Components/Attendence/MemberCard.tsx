import React, {useState, useRef } from "react";
import { MkData } from "./MkData";

interface MemberCardProps {
  mk: MkData;
  onActivate: (mk: MkData) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ mk, onActivate }) => {
  return (
    <div className="grid-item" onClick={() => onActivate(mk)}>
      <img
        src={mk.MkImage}
        alt={mk.Name}
        className={`mk-image ${mk.IsPresent ? "" : "grayscale"}`}
      />
      <div className="mk-name">{mk.Name}</div>
    </div>
  );
};

export default MemberCard;
