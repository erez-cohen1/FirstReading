'use client';
import React, { useState, useEffect } from "react";

type VoteDetailsProps = {
  voteId: number;
  onBack: () => void; // Function to return to the main list
};

type VoteHeader = {
  ItemTitle: string;
  VoteDateStr: string;
  VoteTimeStr: string;
  Decision: string;
  ChairmanName: string;
  AcceptedText: string;
};

type VoteCounter = {
  Title: string;
  countOfResult: number;
};

type VoteDetail = {
  MkName: string;
  FactionName: string;
  Title: string;
};

type VoteDetailsData = {
  VoteHeader: VoteHeader[];
  VoteCounters: VoteCounter[];
  VoteDetails: VoteDetail[];
};

const VoteDetails = ({ voteId, onBack }: VoteDetailsProps) => {
  const [voteDetails, setVoteDetails] = useState<VoteDetailsData | null>(null);

  useEffect(() => {
    const fetchVoteDetails = async () => {
      try {
        const response = await fetch(
          `https://www.knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/${voteId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vote details");
        }

        const data = await response.json();
        setVoteDetails(data);
      } catch (error) {
        console.error("Error fetching vote details:", error);
      }
    };

    fetchVoteDetails();
  }, [voteId]);

  if (!voteDetails) {
    return <div>Loading vote details...</div>;
  }

  // Extracting the first vote header (as the JSON suggests an array)
  const voteHeader = voteDetails.VoteHeader[0];

  return (
    <div className="Component">
      <header className="Component-header">
      {/* <h1>פרטי ההצבעה</h1> */}
        <button onClick={onBack} className="back-button">
          חזרה לרשימה
        </button>
      </header>
      <main className="Component-main">
        <section className="Schedule-section" id="Vote-Details">
          <div>
            <strong>נושא הדיון:</strong> {voteHeader.ItemTitle || "N/A"}
          </div>
          <div>
            <strong>תאריך:</strong> {voteHeader.VoteDateStr || "N/A"}
          </div>
          <div>
            <strong>שעה:</strong> {voteHeader.VoteTimeStr || "N/A"}
          </div>
          <div>
            <strong>החלטה:</strong> {voteHeader.Decision || "N/A"}
          </div>
          <div>
            <strong>יושב ראש:</strong> {voteHeader.ChairmanName || "N/A"}
          </div>
          <div>
            <strong>תוצאה:</strong> {voteHeader.AcceptedText || "N/A"}
          </div>
          <div>
            <strong>תוצאות:</strong>
            <ul>
              {voteDetails.VoteCounters.map((counter, idx) => (
                <li key={idx}>
                  {counter.Title}: {counter.countOfResult}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>פירוט ההצבעות:</strong>
            <ul>
              {voteDetails.VoteDetails.map((detail, idx) => (
                <li key={idx}>
                  {detail.MkName} ({detail.FactionName}): {detail.Title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <footer className="Component-footer">
        <a href="#" className="expand-component">
        </a>
      </footer>
    </div>
  );
};

export default VoteDetails;
