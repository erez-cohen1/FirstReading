"use client";
import React, { useEffect, useState } from "react";

type Vote = {
  VoteDate: string;
  VoteDateStr: string;
  VoteTimeStr: string;
  VoteType: string;
  ItemTitle: string;
};

type VoteData = {
  Table: Vote[];
};

const VoteCount = () => {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [showItemTitles, setShowItemTitles] = useState(false);

  // Helper function to get today's date in the "YYYY-MM-DD" format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, so add 1
    const day = today.getDate().toString().padStart(2, "0"); // Ensure day is always 2 digits
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const payload = {
          SearchType: 1,
          FromDate: getTodayDate(), // Use today's date
          ToDate: getTodayDate(), // Use today's date
        };

        const response = await fetch(
          "https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVotesHeaders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              SelectedDate: "2024-12-26T00:00:00.000Z",
              // SelectedDate: todayString,
              SelectedMonth: null,
              SelectedYear: null,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch votes data");
        }

        const data: VoteData = await response.json();
        setVoteData(data);
      } catch (error) {
        console.error("Error fetching votes data:", error);
      }
    };

    fetchVoteData();
  }, []);

  const toggleItemTitles = () => {
    setShowItemTitles(!showItemTitles);
  };

  if (!voteData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="Component" onClick={toggleItemTitles} id="Schedule">
        <header className="Component-header">
          <h1>הצבעות</h1>
        </header>
        <main className="Component-main">
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {voteData.Table.map((vote, index) => (
                <li key={index}>
                  <div>
                    <strong>נושא הדיון:</strong> {vote.ItemTitle}
                  </div>
                  <div>
                    <strong>תאריך:</strong> {vote.VoteDateStr}
                  </div>
                  <div>
                    <strong>זמן:</strong> {vote.VoteTimeStr}
                  </div>
                  <div>
                    <strong>אופן ההצבעה:</strong> {vote.VoteType}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
        <footer className="Component-footer">
          <div>
            <a href="#" className="expand-component">
              <p>לרשימה המלאה</p>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default VoteCount;
