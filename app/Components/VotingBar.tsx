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

  return (
    <div style={{ width: "60%" }}>
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
        {inFavorPercentage > 0 && (
          <div
            style={{
              width: `${inFavorPercentage}%`,
              backgroundColor: "#FF6700",
              height: "100%",
            }}
          />
        )}
        {/* נמנע */}
        {abstainPercentage > 0 && (
          <div
            style={{
              width: `${abstainPercentage}%`,
              backgroundColor: "#FF670033",
              height: "100%",
            }}
          />
        )}
        {/* נגד */}
        {againstPercentage > 0 && (
          <div
            style={{
              width: `${againstPercentage}%`,
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
          marginTop: "0.5rem",
          fontSize: "0.8rem",
          position: "relative",
        }}
      >
        {/* בעד */}
        {inFavorPercentage > 0 && (
          <div
            style={{
              width: `${inFavorPercentage}%`,
              textAlign: "center",
            }}
          >
            <div>{inFavor}</div> {/* Vote count for "בעד" */}
            <div>בעד</div>
          </div>
        )}
        {/* נמנע */}
        {abstainPercentage > 0 && (
          <div
            style={{
              width: `${abstainPercentage}%`,
              textAlign: "center",
            }}
          >
            <div>{abstain}</div> {/* Vote count for "נמנע" */}
            <div>נמנע</div>
          </div>
        )}
        {/* נגד */}
        {againstPercentage > 0 && (
          <div
            style={{
              width: `${againstPercentage}%`,
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
