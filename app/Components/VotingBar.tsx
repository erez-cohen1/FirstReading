import React from "react";

type VoteBarProps = {
  inFavor: number;
  against: number;
  abstain: number;
};

const VoteBar = ({ inFavor, against, abstain }: VoteBarProps) => {
  // Calculate the total votes
  const total = inFavor + against + abstain;

  // Calculate percentages
  const inFavorPercentage = (inFavor / total) * 100;
  const againstPercentage = (against / total) * 100;
  const abstainPercentage = (abstain / total) * 100;

  // Set minimum width for each category
  const minWidth = 12;

  // Apply the minimum width only to values greater than 0
  const inFavorAdjusted = inFavorPercentage > 0 ? Math.max(inFavorPercentage, minWidth) : 0;
  const againstAdjusted = againstPercentage > 0 ? Math.max(againstPercentage, minWidth) : 0;
  const abstainAdjusted = abstainPercentage > 0 ? Math.max(abstainPercentage, minWidth) : 0;

  // Calculate the total adjusted width
  const totalAdjusted = inFavorAdjusted + againstAdjusted + abstainAdjusted;

  // Calculate the remaining space after applying the minimum width to each option
  const remainingSpace = 100 - totalAdjusted;

  // Distribute the remaining space across the categories proportionally
  const inFavorFinalWidth = inFavorAdjusted > 0 ? (inFavorAdjusted / totalAdjusted) * (100 - remainingSpace) : 0;
  const againstFinalWidth = againstAdjusted > 0 ? (againstAdjusted / totalAdjusted) * (100 - remainingSpace) : 0;
  const abstainFinalWidth = abstainAdjusted > 0 ? (abstainAdjusted / totalAdjusted) * (100 - remainingSpace) : 0;

  return (
    <div style={{ width: "70%" }}>
      {/* Bar */}
      <div
        style={{
          display: "flex",
          height: "1rem",
          width: "100%",
          border: "1px solid #ccc",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* בעד */}
        {inFavorFinalWidth > 0 && (
          <div
            style={{
              width: `${inFavorFinalWidth}%`,
              backgroundColor: "#FF6700",
              height: "100%",
            }}
          />
        )}
        {/* נמנע */}
        {abstainFinalWidth > 0 && (
          <div
            style={{
              width: `${abstainFinalWidth}%`,
              backgroundColor: "#FF670033",
              height: "100%",
            }}
          />
        )}
        {/* נגד */}
        {againstFinalWidth > 0 && (
          <div
            style={{
              width: `${againstFinalWidth}%`,
              backgroundColor: "#0900BD",
              height: "100%",
            }}
          />
        )}
      </div>

      {/* Labels and Vote Counts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1rem",
          position: "relative",
        }}
      >
        {/* בעד */}
        {inFavorFinalWidth > 0 && (
          <div
            style={{
              width: `${inFavorFinalWidth}%`,
              textAlign: "center",
            }}
          >
            <div>{inFavor}</div> {/* Vote count for "בעד" */}
            <div>בעד</div>
          </div>
        )}
        {/* נמנע */}
        {abstainFinalWidth > 0 && (
          <div
            style={{
              width: `${abstainFinalWidth}%`,
              textAlign: "center",
            }}
          >
            <div>{abstain}</div> {/* Vote count for "נמנע" */}
            <div>נמנע</div>
          </div>
        )}
        {/* נגד */}
        {againstFinalWidth > 0 && (
          <div
            style={{
              width: `${againstFinalWidth}%`,
              textAlign: "center",
            }}
          >
            <div>{against}</div> {/* Vote count for "נגד" */}
            <div>נגד</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteBar;
