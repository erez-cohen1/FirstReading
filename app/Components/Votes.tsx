"use client";

import React, { useEffect, useState } from "react";
import VoteBar from "./VotingBar";
import initiatorsData from "./mkDetails.json";

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
  numVoted: number;
  numInPlenum: number;
};

type Voter = {
  MkName: string;
  FactionName: string;
  Title: string;
};

type VoteData = {
  Table: Vote[];
};

const Votes = ({ date, isShrunk, headerNum }: { date: Date; isShrunk: boolean; headerNum: number }) => {
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [expandedVoteId, setExpandedVoteId] = useState<number | null>(null);
  const [voterFilters, setVoterFilters] = useState<Record<number, string>>({
    0: "בעד", // Default filter is "בעד" for all votes initially
  });
  const [searchTerm, setSearchTerm] = useState<string>(""); // New state for search term

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isSameDay = (voteDate: string, date: Date) => {
    const [day, month, year] = voteDate.split(".").map(Number);
    const voteDateObj = new Date(Date.UTC(year, month - 1, day));
    return voteDateObj.toISOString().split("T")[0] === formatDate(date);
  };

  const getMkImage = (mkName: string) => {
    // Normalize spaces to a single space and trim leading/trailing spaces
    const normalizedMkName = mkName.replace(/\s+/g, " ").trim();

    const nameWords = normalizedMkName.split(" ").map((word) => word.toLowerCase()); // Split and lowercase mkName
    const mk = Object.values(initiatorsData).find((entry: any) => {
      const entryWords = entry.Name.toLowerCase().split(" "); // Split and lowercase entry.Name
      // Check if all words in mkName are present in entry.Name
      return nameWords.every((word) => entryWords.includes(word));
    });

    return mk ? mk.MkImage : null; // Return the MkImage if found, otherwise null
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

        const votesWithDetails = await Promise.all(
          data.Table.map(async (vote) => {
            const voteDetailsResponse = await fetch(
              `https://knesset.gov.il/WebSiteApi/knessetapi/Votes/GetVoteDetails/${vote.VoteId}`
            );

            if (!voteDetailsResponse.ok) throw new Error("Failed to fetch vote details");

            const voteDetails = await voteDetailsResponse.json();
            const acceptanceText = voteDetails.VoteHeader[0]?.AcceptedText || "N/A";
            const decision = voteDetails.VoteHeader[0]?.Decision || "N/A";

            const voters: Voter[] = voteDetails.VoteDetails.map((voter: any) => ({
              MkName: voter.MkName,
              FactionName: voter.FactionName,
              Title: voter.Title,
            }));

            const inFavorCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "בעד");
            const inFavor = inFavorCounter ? inFavorCounter.countOfResult : 0;

            const againstCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "נגד");
            const against = againstCounter ? againstCounter.countOfResult : 0;

            const abstainCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "נמנע");
            const abstain = abstainCounter ? abstainCounter.countOfResult : 0;

            const presentAndNotVotedCounter = voteDetails.VoteCounters.find((counter: any) => counter.Title === "נוכח ולא הצביע");
            const presentAndNotVoted = presentAndNotVotedCounter ? presentAndNotVotedCounter.countOfResult : 0;

            // Calculate num1 (בעד, נגד, נמנע) and num2 (בעד, נגד, נמנע, נוכח ולא הצביע)
            const numVoted = inFavor + against + abstain;
            const numInPlenum = inFavor + against + abstain + presentAndNotVoted;

            return {
              ...vote,
              AcceptedText: acceptanceText,
              Decision: decision,
              Voters: voters,
              inFavor,
              against,
              abstain,
              numVoted,
              numInPlenum,
            };
          })
        );

        // Initialize voter filters with "בעד" as the default
        const initialFilters = votesWithDetails.reduce((filters: Record<number, string>, vote: any) => {
          filters[vote.VoteId] = "בעד";
          return filters;
        }, {});

        setVoterFilters(initialFilters); // Set the default filters

        setVoteData({ Table: votesWithDetails });
      } catch (error) {
        console.error("Error fetching vote data", error);
      }
    };

    fetchVoteData();
  }, [date]);

  const toggleVoteDetails = (voteId: number) => {
    setExpandedVoteId(expandedVoteId === voteId ? null : voteId);
  };

  const handleVoterFilterChange = (voteId: number, newFilter: string) => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterVoters = (voters: Voter[], voteId: number) => {
    const filter = voterFilters[voteId];
    return voters
      .filter((voter) => searchTerm === "" || voter.MkName.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((voter) => {
        if (filter === "בעד") {
          return voter.Title === "בעד";
        } else if (filter === "נגד") {
          return voter.Title === "נגד";
        } else if (filter === "נמנע") {
          return voter.Title === "נמנע";
        }
        return true;
      });
  };

  if (!voteData) {
    return <div>Loading votes...</div>;
  }

  const filteredVotes = voteData.Table.filter((vote) => isSameDay(vote.VoteDateStr, date));

  return (
    <>
      <header className={`Component-header ${isShrunk ? `header-4-small` : `header-4-big`}`}>
        <a href="#Votes-main" className="header-link">
          <h1>הצבעות</h1>
        </a>
      </header>
      <main className="Component-main" id="Votes-main">
        <section className="votes-section">
          {filteredVotes.length > 0
            ? filteredVotes.map((vote, index) => (
                <div key={index} className="law-event-cell-opened">
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <p className="vote-result-text">{vote.AcceptedText === "ההצעה לא התקבלה" ? "לא עבר" : "עבר"}</p>
                      <p>
                        {vote.numVoted}/{vote.numInPlenum}
                      </p>
                      <p>הצביעו</p>
                    </div>
                    <VoteBar inFavor={vote.inFavor} against={vote.against} abstain={vote.abstain} />
                  </div>
                  {expandedVoteId === vote.VoteId && (
                    <div>
                      <br></br>
                      <p className="law-status" style={{ marginRight: "1rem" }}>
                        <p>החלטה:</p> {vote.Decision || "N/A"}
                      </p>
                      {filteringButtons(handleVoterFilterChange, vote, voterFilters)}
                      {searchBar(searchTerm, handleSearchChange)}
                      {displayResults(filterVoters, vote, getMkImage, voterFilters[vote.VoteId])}
                    </div>
                  )}
                  <br />
                  <td className="law-horizontal-line"></td>
                  <br />
                </div>
              ))
            : noResults(date)}
        </section>
      </main>
    </>
  );
};

export default Votes;

function noResults(date: Date): React.ReactNode {
  return (
    <p>
      לא נמצאו הצבעות בתאריך{" "}
      {date.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  );
}

function filteringButtons(
  handleVoterFilterChange: (voteId: number, newFilter: string) => void,
  vote: Vote,
  voterFilters: Record<number, string>
) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="vote-display-options">
        <button
          onClick={() => handleVoterFilterChange(vote.VoteId, "בעד")}
          className={(voterFilters[vote.VoteId] || "בעד") === "בעד" ? "active" : ""}
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
  );
}

function displayResults(
  filterVoters: (voters: Voter[], voteId: number) => Voter[],
  vote: Vote,
  getMkImage: (mkName: string) => string | null,
  filter: string
) {
  const label = filter === "בעד" ? "בעד" : filter === "נגד" ? "נגד" : filter === "נמנע" ? "נמנעים.ות" : "בעד";

  return (
    <div>
      <p className="vote-label">{label}</p>
      <div
      className="grid-content"
      >
        {filterVoters(vote.Voters, vote.VoteId).map((voter, voterIndex) => {
          const nameParts = voter.MkName.split(" ");

          return (
          
            <div
              key={voterIndex}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                maxWidth: "calc(25% - 0.5rem)",
              }}
            >
              {getMkImage(voter.MkName) && (
                <div className="grid-item">
                  <img src={getMkImage(voter.MkName) || ""} alt={voter.MkName} className="mk-image " />
                  <div className="mk-name">
                    <p className="law-value">{voter.MkName}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function searchBar(searchTerm: string, handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="vote-search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
          <circle cx="6.5" cy="6.5" r="6" stroke="#0900BD" stroke-opacity="0.3" />
          <path d="M10.5 11L16.5 17" stroke="#0900BD" stroke-opacity="0.3" />
        </svg>
        <input
          className="vote-search-bar input"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="לחיפוש חבר.ת כנסת לפי שם"
        />
      </div>
    </div>
  );
}
