"use client";

import React, { useEffect, useState } from "react";
import VoteBar from "./VotingBar";

type Vote = {
  VoteId: number;
  VoteDateStr: string;
  VoteTimeStr: string;
  VoteType: string;
  ItemTitle: string;
  AcceptedText: string;
  Decision: string;
  Voters: Voter[];
  inFavor: number;
  against: number;
  abstain: number;
};

type Voter = {
  MkName: string;
  FactionName: string;
  Title: string;
};

type VoteData = {
  Table: Vote[];
};

const Votes = ({ date, isShrunk }: { date: Date; isShrunk: boolean }) => {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [expandedVoteId, setExpandedVoteId] = useState<number | null>(null);
  const [voterFilters, setVoterFilters] = useState<Record<number, string>>({
    // Default filter is "בעד" for all votes initially
    0: "בעד",
  });

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

        const response = await fetch("https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVotesHeaders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to fetch votes data");

        const data: VoteData = await response.json();

        // console.log("Fetched vote headers:", data); // Print fetched data

        const votesWithDetails = await Promise.all(
          data.Table.map(async (vote) => {
            const voteDetailsResponse = await fetch(
              `https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/${vote.VoteId}`
            );

            if (!voteDetailsResponse.ok) throw new Error("Failed to fetch vote details");

            const voteDetails = await voteDetailsResponse.json();

            // console.log("Vote details for VoteId", vote.VoteId, voteDetails); // Print vote details

            const acceptanceText = voteDetails.VoteHeader[0]?.AcceptedText || "N/A";
            const decision = voteDetails.VoteHeader[0]?.Decision || "N/A";

            const voters: Voter[] = voteDetails.VoteDetails.map((voter: any) => ({
              MkName: voter.MkName,
              FactionName: voter.FactionName,
              Title: voter.Title,
            }));

            // Extract counts for inFavor, against, abstain
            const inFavorCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "בעד");
            const inFavor = inFavorCounter ? inFavorCounter.countOfResult : 0;

            const againstCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "נגד");
            const against = againstCounter ? againstCounter.countOfResult : 0;

            const abstainCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "נמנע");
            const abstain = abstainCounter ? abstainCounter.countOfResult : 0;

            return {
              ...vote,
              AcceptedText: acceptanceText,
              Decision: decision,
              Voters: voters,
              inFavor,
              against,
              abstain,
            };
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
    // If the filter is the same as the previous one, do nothing
    setVoterFilters((prev) => {
      const currentFilter = prev[voteId];
      if (currentFilter === newFilter) {
        return prev; // No changes if clicked again on the same button
      }
      return {
        ...prev,
        [voteId]: newFilter,
      };
    });
  };

  if (!voteData) {
    return <div>Loading votes...</div>;
  }

  const filteredVotes = voteData.Table.filter((vote) => isSameDay(vote.VoteDateStr, date));

  return (
    <>
      <header className={`Component-header ${isShrunk ? "header-4-small" : "header-4-big"}`}>
        <a href="#Votes-main" className="header-link">
          <h1>הצבעות</h1>
        </a>
      </header>
      <main className="Component-main" id="Votes-main">
        <section className="votes-section">
          {filteredVotes.length > 0 ? (
            filteredVotes.map((vote, index) => (
              <div key={index} className="schedule-event-cell-opened">
                <div
                  className={`vote ${expandedVoteId === vote.VoteId ? "open" : ""}`}
                  onClick={() => toggleVoteDetails(vote.VoteId)}
                >
                  <div className="law-content">
                    <div className="vote-name">{vote.ItemTitle || "N/A"}</div>
                  </div>
                  <i className={`arrow ${expandedVoteId === vote.VoteId ? "up" : "down"}`} />
                </div>
                <div className="vote-infograph-div">
                  <h3>{vote.AcceptedText === "ההצעה לא התקבלה" ? "לא עבר" : "עבר"}</h3>
                  <VoteBar inFavor={vote.inFavor} against={vote.against} abstain={vote.abstain} />
                </div>

                {expandedVoteId === vote.VoteId && (
                  <div>
                    <p className="law-status">
                      <strong>ההחלטה:</strong> {vote.Decision || "N/A"}
                    </p>
                    <div>
                      <div className="vote-display-options">
                        <button
                          onClick={() => handleVoterFilterChange(vote.VoteId, "בעד")}
                          className={voterFilters[vote.VoteId] === "בעד" ? "active" : ""}
                        >
                          <div className="vote-button-content">
                            <div className="vote-button-number">{vote.inFavor}</div>
                            <div>בעד</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handleVoterFilterChange(vote.VoteId, "נמנע")}
                          className={voterFilters[vote.VoteId] === "נמנע" ? "active" : ""}
                        >
                          <div className="vote-button-content">
                            <div className="vote-button-number">{vote.abstain}</div>
                            <div>נמנעים.ות</div>
                          </div>
                        </button>
                        <button
                          onClick={() => handleVoterFilterChange(vote.VoteId, "נגד")}
                          className={voterFilters[vote.VoteId] === "נגד" ? "active" : ""}
                        >
                          <div className="vote-button-content">
                            <div className="vote-button-number">{vote.against}</div>
                            <div>נגד</div>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <strong>מצביעים:</strong>
                      <ul>
                        {vote.Voters.filter((voter) => {
                          const filter = voterFilters[vote.VoteId] || "בעד"; // Default to "בעד"
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
    </>
  );
};

export default Votes;
