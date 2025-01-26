import React from "react";

const createVoteBar = (inFavor: number, against: number, abstain: number) => {
  // Calculate the total votes
  const total = inFavor + against + abstain;

  // Calculate percentages
  const inFavorPercentage = (inFavor / total) * 100;
  const againstPercentage = (against / total) * 100;
  const abstainPercentage = (abstain / total) * 100;

  return (
    <div style={{ display: "flex", height: "1rem", width: "100%", border: "1px solid #ccc", overflow: "hidden" }}>
      <div
        style={{
          width: `${inFavorPercentage}%`,
          backgroundColor: "#FF6700",
          height: "100%",
        }}
        title={`בעד: ${inFavor} (${inFavorPercentage.toFixed(1)}%)`}
      />

      <div
        style={{
          width: `${abstainPercentage}%`,
          backgroundColor: "#FF6700 20%", 
          height: "100%",
        }}
        title={`נמנע: ${abstain} (${abstainPercentage.toFixed(1)}%)`}
      />

      <div
        style={{
          width: `${againstPercentage}%`,
          backgroundColor: "#0900BD", 
          height: "100%",
        }}
        title={`נגד: ${against} (${againstPercentage.toFixed(1)}%)`}
      />

    </div>
  );
};

export default createVoteBar;
