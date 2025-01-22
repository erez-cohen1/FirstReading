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
        <div
            ref={arrowRef}
            className={`arrow up fixed-arrow ${isArrowVisible ? "visible" : "hidden"}`}
            onClick={() => {
            setShowModal(false); // Close the modal
            window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
            }}
        ></div>
            <div className="attendance-grid">
            <div className="grid-content">
                {filteredData.map((mk) => (
                    <MemberCard key={mk.MkId} mk={mk} />
                ))}
            </div>
            </div>
        </div>
        </div>
    )
  
};

export default Modal;
