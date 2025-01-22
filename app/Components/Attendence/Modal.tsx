import React, {useState, useRef } from "react";
import { MkData } from "./MkData";
import MemberCard from "./MemberCard";

interface ModalProps {
  mkData: MkData[];
  displayOption: "all" | "coalition" | "opposition" | "goverment";
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}


const Modal: React.FC<ModalProps> = ({ mkData, displayOption, setShowModal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isArrowVisible, setIsArrowVisible] = useState(true);
  const arrowRef = useRef<HTMLDivElement>(null);

  const filteredData =
    displayOption === "coalition"
      ? mkData.filter((mk) => mk.IsCoalition)
      : displayOption === "opposition"
      ? mkData.filter((mk) => !mk.IsCoalition)
      : displayOption == "goverment"
      ? mkData.filter((mk) => mk.isGoverment)
      : mkData;

  return (
    <div className="modal-overlay">
        <div className="modal-content Component" ref={modalRef}>
            <div className="attendance-grid">
            <div className="grid-content">
                {filteredData.slice().sort((a, b) => {
            if (displayOption === "coalition") {
                // Sort coalition members first
                if (a.IsCoalition !== b.IsCoalition) return b.IsCoalition ? 1 : -1;
            } else if (displayOption === "opposition") {
                // Sort opposition members first
                if (a.IsCoalition !== b.IsCoalition) return b.IsCoalition ? -1 : 1;
            } else if (displayOption === "goverment") {
                // Sort opposition members first
                if (a.isGoverment !== b.isGoverment) return b.isGoverment ? 1 : -1;
            }
            // Sort within each group by presence
            return b.IsPresent === a.IsPresent ? 0 : b.IsPresent ? 1 : -1;
            }).map((mk) => (
                      <MemberCard key={mk.MkId} mk={mk} />
                  ))}
            </div>
            </div>
        </div>
        </div>
    )
  
};

export default Modal;
