"use client";
import React, { useEffect, useState } from "react";
import VoteDetails from "./VotesResults";  // Make sure to import VoteDetails

type Vote = {
  VoteId: number;
  VoteDateStr: string;
  VoteTimeStr: string;
  VoteType: string;
  ItemTitle: string;
  AcceptedText: string;
};

type VoteData = {
  Table: Vote[];
};

const Votes = () => {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<number | null>(null);  // Track the selected vote

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const payload = {
          SearchType: 1,
          FromDate: getTodayDate(),
          ToDate: getTodayDate(),
        };

        const response = await fetch(
          "https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVotesHeaders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch votes data");
        }

        const data: VoteData = await response.json();
        const votesWithDetails = await Promise.all(
          data.Table.map(async (vote) => {
            const voteDetailsResponse = await fetch(
              `https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/${vote.VoteId}`
            );

            if (!voteDetailsResponse.ok) {
              throw new Error("Failed to fetch vote details");
            }

            const voteDetails = await voteDetailsResponse.json();
            const acceptanceText = voteDetails.VoteHeader[0]?.AcceptedText || "N/A";

            return { ...vote, AcceptedText: acceptanceText };
          })
        );

        setVoteData({ Table: votesWithDetails });
      } catch (error) {
        console.error("Error fetching votes data:", error);
      }
    };

    fetchVoteData();
  }, []);

  const handleVoteClick = (voteId: number) => {
    setSelectedVoteId(voteId);  // Set the selected vote ID
  };

  const handleBack = () => {
    setSelectedVoteId(null);  // Go back to the vote list
  };

  if (!voteData) {
    return <div>Loading votes...</div>;
  }

  return (
    <div className="Component">
      <header className="Component-header">
        <h1>הצבעות</h1>
      </header>
      <main className="Component-main">
        {selectedVoteId ? (
          <VoteDetails voteId={selectedVoteId} onBack={handleBack} />
        ) : (
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {voteData.Table.map((vote) => (
                <li key={vote.VoteId} onClick={() => handleVoteClick(vote.VoteId)}>
                  <div>
                    <strong>נושא הדיון:</strong> {vote.ItemTitle || "N/A"}
                  </div>
                  <div>
                    <strong>תאריך:</strong> {vote.VoteDateStr || "N/A"}
                  </div>
                  <div>
                    <strong>שעה:</strong> {vote.VoteTimeStr || "N/A"}
                  </div>
                  <div>
                    <strong>אופן ההצבעה:</strong> {vote.VoteType || "N/A"}
                  </div>
                  <div>
                    <strong>תוצאה:</strong> {vote.AcceptedText || "N/A"}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <footer className="Component-footer">
        <a href="#" className="expand-component">
          <p>לרשימה המלאה</p>
        </a>
      </footer>
    </div>
  );
};

export default Votes;
