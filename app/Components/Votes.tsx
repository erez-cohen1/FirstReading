"use client";

import React, { useEffect, useState } from "react";
import createVoteBar from "./VotingBar";

type Vote = {
  VoteId: number;
  VoteDateStr: string;
  VoteTimeStr: string;
  VoteType: string;
  ItemTitle: string;
  AcceptedText: string;
  Decision: string; // Added Decision field
  Voters: Voter[];
};

type Voter = {
  MkName: string;
  FactionName: string;
  Title: string; // Vote result (e.g., "בעד", "נגד", "נמנע", "נוכח")
};

type VoteData = {
  Table: Vote[];
};

const Votes = ({ date }: { date: Date }) => {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [expandedVoteId, setExpandedVoteId] = useState<number | null>(null);
  const [voterFilters, setVoterFilters] = useState<Record<number, string>>({});

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isSameDay = (voteDate: string, date: Date) => {
    const [day, month, year] = voteDate.split(".").map(Number);
    const voteDateObj = new Date(Date.UTC(year, month - 1, day));
    return voteDateObj.toISOString().split("T")[0] === formatDate(date);
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch votes data");

        const data: VoteData = await response.json();

        const votesWithDetails = await Promise.all(
          data.Table.map(async (vote) => {
            const voteDetailsResponse = await fetch(
              `https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/${vote.VoteId}`
            );

            if (!voteDetailsResponse.ok)
              throw new Error("Failed to fetch vote details");

            const voteDetails = await voteDetailsResponse.json();
            const acceptanceText =
              voteDetails.VoteHeader[0]?.AcceptedText || "N/A";
            const decision = voteDetails.VoteHeader[0]?.Decision || "N/A";

            const voters: Voter[] = voteDetails.VoteDetails.map((voter: any) => ({
              MkName: voter.MkName,
              FactionName: voter.FactionName,
              Title: voter.Title,
            }));

            return { ...vote, AcceptedText: acceptanceText, Decision: decision, Voters: voters };
          })
        );

        setVoteData({ Table: votesWithDetails });
      } catch (error) {
        console.error("Error fetching votes data:", error);
      }
    };

    fetchVoteData();
  }, [date]);

  const toggleVoteDetails = (voteId: number) => {
    setExpandedVoteId(expandedVoteId === voteId ? null : voteId);
  };

  const handleVoterFilterChange = (voteId: number, newFilter: string) => {
    setVoterFilters((prev) => ({
      ...prev,
      [voteId]: prev[voteId] === newFilter ? "" : newFilter,
    }));
  };

  if (!voteData) {
    return <div>Loading votes...</div>;
  }

  const filteredVotes = voteData.Table.filter((vote) =>
    isSameDay(vote.VoteDateStr, date)
  );

  const inFavor = 30;
  const against = 20;
  const abstain = 10;

  return (
    <div className="Component" id="Votes">
      <header className="Component-header">
        <h1>הצבעות</h1>
      </header>
      <main className="Component-main">
        <section className="votes-section">
          {filteredVotes.length > 0 ? (
            filteredVotes.map((vote, index) => (
              <div key={index} className="schedule-event-cell-opened">
                <div
                  className={`law ${expandedVoteId === vote.VoteId ? "open" : ""}`}
                  onClick={() => toggleVoteDetails(vote.VoteId)}
                >
                  <div className="law-content">
                    <div className="law-name">{vote.ItemTitle || "N/A"}</div>
                    {/* <div className="law-status">{vote.AcceptedText || "N/A"}</div> */}
                    {createVoteBar(inFavor, against, abstain)}

                  </div>
                  <div>
                  <i className={`arrow ${expandedVoteId === vote.VoteId ? "up" : "down"}`} />

                  </div>
                  
                  </div>

                {expandedVoteId === vote.VoteId && (
                  <div>
                    <p className="law-status">
                      <strong>ההחלטה:</strong> {vote.Decision || "N/A"}
                    </p>
                    <div>
                      <div style={{ marginBottom: "10px" }}>
                        <button onClick={() => handleVoterFilterChange(vote.VoteId, "בעד")}>
                          בעד
                        </button>
                        <button onClick={() => handleVoterFilterChange(vote.VoteId, "נגד")}>
                          נגד
                        </button>
                        <button onClick={() => handleVoterFilterChange(vote.VoteId, "נמנע")}>
                          נמנע
                        </button>
                      </div>
                    </div>
                    <div>
                      <strong>מצביעים:</strong>
                      <ul>
                        {vote.Voters.filter((voter) => {
                          const filter = voterFilters[vote.VoteId] || "";
                          return filter === "" || voter.Title === filter;
                        }).map((voter, voterIndex) => (
                          <li key={voterIndex}>
                            {voter.MkName} - {voter.FactionName} ({voter.Title})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <br />
                <td className="law-horizontal-line"></td>
                <br />
              </div>
            ))
          ) : (
            <p>
              לא נמצאו הצבעות בתאריך{" "}
              {date.toLocaleDateString("he-IL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </section>
      </main>

      <div>
\    </div>
    </div>
  );
};

export default Votes;
