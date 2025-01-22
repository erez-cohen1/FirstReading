import React from "react";
import { MkData } from "./MkData";

interface AttendanceChartProps {
  mkData: MkData[];
  displayOption: "all" | "coalition" | "opposition" | "goverment";
}



const AttendanceChart: React.FC<AttendanceChartProps> = ({ mkData, displayOption }) => {
  
  return (
    <div className="chart-wrapper">
          {mkData
            .slice() // Create a shallow copy of the data
            .sort((a, b) => {
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
                className={`chart-circle ${mk.IsPresent ? "present" : "absent"} ${isMatchingOption ? "" : "dimmed"}`}
                ></div>
            );
          })}
    </div>
  );
};

export default AttendanceChart;
