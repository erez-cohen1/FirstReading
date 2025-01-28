import React, { useState, useRef, useEffect } from "react";
import { MkData } from "./MkData";

interface DisplayOptionsProps {
  mkData: MkData[];
  displayOption: "all" | "coalition" | "opposition" | "goverment";
  setDisplayOption: React.Dispatch<
    React.SetStateAction<"all" | "coalition" | "opposition" | "goverment">
  >;
  modalRef: React.RefObject<HTMLDivElement>;
}

const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  mkData,
  displayOption,
  setDisplayOption,
  modalRef
}) => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Dynamically update the indicator's position and size
  useEffect(() => {
    const activeButton = document.querySelector(
      `.display-options button.active`
    ) as HTMLElement;
    const indicator = indicatorRef.current;

    if (activeButton && indicator) {
      const { offsetLeft, offsetWidth } = activeButton;
      indicator.style.width = `${offsetWidth}px`;
      indicator.style.left = `${offsetLeft}px`;
    }
  }, [displayOption]); // Re-run whenever displayOption changes

  const getCounts = () => {
    const coalition = mkData.filter((mk) => mk.IsCoalition);
    const opposition = mkData.filter((mk) => !mk.IsCoalition);
    const goverment = mkData.filter((mk) => mk.isGoverment);

    return {
      coalitionPresent: coalition.filter((mk) => mk.IsPresent).length,
      coalitionAbsent: coalition.filter((mk) => !mk.IsPresent).length,
      oppositionPresent: opposition.filter((mk) => mk.IsPresent).length,
      oppositionAbsent: opposition.filter((mk) => !mk.IsPresent).length,
      govermentPresent: goverment.filter((mk) => mk.IsPresent).length,
      govermentAbsent: goverment.filter((mk) => !mk.IsPresent).length,
    };
  };

  const counts = getCounts();

  return (
    <div className="display-options" ref={modalRef}>
      {/* Indicator */}
      <div className="indicator" ref={indicatorRef}></div>
      <button
        onClick={() => setDisplayOption("all")}
        className={displayOption === "all" ? "active" : ""}
      >
        <div>
          <span>{counts.oppositionPresent + counts.coalitionPresent}</span>/
          <span>{mkData.length}</span>
        </div>
        <p>במשכן</p>  
      </button>
      <button
        onClick={() => setDisplayOption("opposition")}
        className={displayOption === "opposition" ? "active" : ""}
      >
        <div>
          <span>{counts.oppositionPresent}</span>/
          <span>{counts.oppositionAbsent + counts.oppositionPresent}</span>
        </div>
        <p>אופוזיציה</p>
      </button>
      <button
        onClick={() => setDisplayOption("coalition")}
        className={displayOption === "coalition" ? "active" : ""}
      >
        <div>
          <span>{counts.coalitionPresent}</span>/
          <span>{counts.coalitionAbsent + counts.coalitionPresent}</span>
        </div>
        <p>קואליציה</p>
      </button>
      <button
        onClick={() => setDisplayOption("goverment")}
        className={displayOption === "goverment" ? "active" : ""}
      >
        <div>
          <span>{counts.govermentPresent}</span>/
          <span>{counts.govermentPresent + counts.govermentAbsent}</span>
        </div>
        <p>שרים</p>
      </button>
    </div>
  );
};

export default DisplayOptions;
