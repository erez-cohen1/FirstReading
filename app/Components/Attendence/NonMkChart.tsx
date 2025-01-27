import React from "react";
import { MkData } from "./MkData";
import { govData } from "./posData";

interface NonMkChartProps {
  mkData: MkData[];
  govData: govData[];
  displayOption: "all" | "coalition" | "opposition" | "goverment";
  modalRef: React.RefObject<HTMLDivElement>;
}



const NonMkChart: React.FC<NonMkChartProps> = ({ mkData, govData, displayOption, modalRef}) => {
  
  return (
    <div className="non-mk-chart">
          {govData
            .slice().filter((mk) => {return !mk.IsMk}) // Create a shallow copy of the data
            .sort((a, b) => {
              // Primary sorting logic
              const scoreA = (a.IsPresent ? 1 : 0)
              const scoreB = (b.IsPresent ? 1 : 0)
              return scoreB - scoreA; // Sort descending
            })
            .map((mk) => {
            return (
                <div
                key={mk.MkId}
                className={`chart-circle coalition ${mk.IsPresent ? "" : "dimmed"}`}
                ></div>
            );
          })}
    </div>
  );
};

export default NonMkChart;
