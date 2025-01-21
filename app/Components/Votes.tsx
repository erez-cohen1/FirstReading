"use client";

import React, { useEffect, useState } from "react";
import VoteDetails from "./VotesResults"; // Ensure this component is correctly implemented

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

const Votes = ({ date }: { date: Date }) => {

  
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const isSameDay = (voteDate: string, date: Date) => {
    // Parse the voteDate (DD.MM.YYYY) into individual components
    const [day, month, year] = voteDate.split('.').map(Number); // Extract day, month, year
  
    // Create a Date object and explicitly set it to UTC (prevent timezone issues)
    const voteDateObj = new Date(Date.UTC(year, month - 1, day)); // Month is 0-indexed
  
    // Format both dates to YYYY-MM-DD (in UTC)
    const voteDateFormatted = voteDateObj.toISOString().split('T')[0];
    const dateFormatted = date.toISOString().split('T')[0];
  
    // Log the formatted dates and comparison result
    console.log("voteDateFormatted:", voteDateFormatted);
    console.log("dateFormatted:", dateFormatted);
    console.log("isSameDay result:", voteDateFormatted === dateFormatted);
  
    return voteDateFormatted === dateFormatted;
  };
  
  
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const formattedDate = formatDate(date);
        const payload = {
          SearchType: 1,
          FromDate: formattedDate,
          ToDate: formattedDate,
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

        // Fetch vote details for each vote
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
  }, [date]); // Add `date` to the dependency array

  const handleVoteClick = (voteId: number) => {
    setSelectedVoteId(voteId);
  };

  const handleBack = () => {
    setSelectedVoteId(null);
  };

  if (!voteData) {
    return <div>Loading votes...</div>;
  }

  const filteredVotes = voteData.Table.filter((vote) => isSameDay(vote.VoteDateStr, date));

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
            {filteredVotes.length > 0 ? (
              <ul>
                {filteredVotes.map((vote) => (
                  <li key={vote.VoteId} className="vote-item" onClick={() => handleVoteClick(vote.VoteId)}>
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
            ) : (
              <p>לא התקיימו הצבעות בתאריך {date.toLocaleDateString("he-IL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
            )}
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
