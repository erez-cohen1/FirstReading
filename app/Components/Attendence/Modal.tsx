import React, { useState, useRef, useEffect } from "react";
import { MkData } from "./MkData";
import MemberCard from "./MemberCard";
import MkInfo from "./MkInfo";

interface ModalProps {
  mkData: MkData[];
  displayOption: "all" | "coalition" | "opposition" | "goverment";
  showModal: boolean;
  modalRef: React.RefObject<HTMLDivElement>;
}

const Modal: React.FC<ModalProps> = ({ mkData, displayOption, showModal, modalRef }) => {
  const [isArrowVisible, setIsArrowVisible] = useState(true);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [activeWindow, setActiveWindow] = useState<Window | null>(null);
  const [selectedMk, setSelectedMk] = useState<MkData | null>(null);

  const handleActivate = (mk: MkData) => {
    setSelectedMk(mk); // Show the `mk-info` box
  };

  const handleClose = () => {
    setSelectedMk(null); // Close the `mk-info` box
  };

  // Close any open window when unmounting
  React.useEffect(() => {
    return () => {
      if (activeWindow) {
        activeWindow.close();
      }
    };
  }, [activeWindow]);

  // Filter data based on the display option
  const filteredData =
    displayOption === "coalition"
      ? mkData.filter((mk) => mk.IsCoalition)
      : displayOption === "opposition"
      ? mkData.filter((mk) => !mk.IsCoalition)
      : displayOption === "goverment"
      ? mkData.filter((mk) => mk.isGoverment)
      : mkData;

  // Further filter data based on the search query
  const searchFilteredData = searchQuery ? filteredData.filter((mk) => mk.Name.startsWith(searchQuery)) : filteredData;

  // Group members by faction
  const groupedByFaction = searchFilteredData.reduce<Record<string, MkData[]>>((acc, mk) => {
    acc[mk.FactionName] = acc[mk.FactionName] || [];
    acc[mk.FactionName].push(mk);
    return acc;
  }, {});

  // Sort factions by group size (descending order)
  const sortedFactions = Object.entries(groupedByFaction).sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      <div className={`modal-overlay ${showModal ? "modal-active" : ""}`}>
        <div className="modal-content">
          <div className="search-bar">
            {/* Search Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
              <circle cx="6.5" cy="6.5" r="6" stroke="#0900BD" strokeOpacity="0.3" />
              <path d="M10.5 11L16.5 17" stroke="#0900BD" strokeOpacity="0.3" />
            </svg>
            {/* Input Field */}
            <input
              type="text"
              placeholder="לחיפוש חבר כנסת לפי שם"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="modal-option-display">
            {displayOption === "all"
              ? "במשכן"
              : displayOption === "coalition"
              ? "קואליציה"
              : displayOption === "opposition"
              ? "אופוזיציה"
              : "שרים"}
          </div>
          <div className="attendance-grid">
            {sortedFactions.map(([factionName, members]) => (
              <div key={factionName} className="faction-group">
                <div className="faction-header">{factionName}</div>
                <div className="grid-content">
                  {members
                    .slice()
                    .sort((a, b) => (b.IsPresent === a.IsPresent ? 0 : b.IsPresent ? 1 : -1))
                    .map((mk) => (
                      <MemberCard key={mk.MkId} mk={mk} onActivate={handleActivate} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      {selectedMk && <MkInfo mk={selectedMk} onClose={handleClose} />}
    </>
  );
  
};

export default Modal;
