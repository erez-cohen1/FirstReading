import React from "react";
import { MkData } from "./MkData";

interface AttendanceChartProps {
  mkData: MkData[];
  displayOption: "all" | "coalition" | "opposition" | "goverment";
  modalRef: React.RefObject<HTMLDivElement>;
}



const AttendanceChart: React.FC<AttendanceChartProps> = ({ mkData, displayOption, modalRef}) => {
  
  return (
    <div className="chart-wrapper" ref={modalRef}>
          {mkData
            .slice() // Create a shallow copy of the data
            .sort((a, b) => {
              // Primary sorting logic
              const scoreA =
                (a.IsCoalition ? 2 : 0) + (((a.IsPresent && a.IsCoalition) || (!a.IsPresent && !a.IsCoalition))  ? 1 : 0) + (displayOption === "goverment" && a.isGoverment ? 2 : 0); // Coalition gets 2, Present adds 1
              const scoreB =
                (b.IsCoalition ? 2 : 0) + (((b.IsPresent && b.IsCoalition) || (!b.IsPresent && !b.IsCoalition)) ? 1 : 0) + (displayOption === "goverment" && b.isGoverment ? 2 : 0);
    
              return scoreB - scoreA; // Sort descending
            })
            .map((mk) => {
            const isMatchingOption =
                (displayOption === "coalition" && mk.IsCoalition) ||
                (displayOption === "opposition" && !mk.IsCoalition) ||
                (displayOption === "goverment" && mk.isGoverment) ||
                displayOption === "all";

            return (
                <div
                key={mk.MkId}
                className={`chart-circle ${mk.IsCoalition ? "coalition" : "opposition"} ${mk.IsPresent ? "" : "dimmed"} ${isMatchingOption ? "" : "crossed"}`}
                ></div>
            );
          })}
    </div>
  );
};

export default AttendanceChart;
