"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import initiatorsData from "../Attendence/mkDetails.json";
import SquaresWithText from "./Law-Info";
import SquareFillComponent from "./LawStatusSqueres";

interface LawSummaryProps {
  queryId: number;
  isShrunk: boolean;
  headerNum: number;
}

const LawSummary: React.FC<LawSummaryProps> = ({ queryId, isShrunk, headerNum }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const [openSquaresWithText, setOpenSquaresWithText] = useState(false);

  const columnNames: Record<string, string> = {
    SummaryLaw: "תקציר החוק",
    StartDate: "תאריך הדיון האחרון",
    statusdesc: "סטטוס",
    billname: "שם החוק",
    committeename: "הוועדה המטפלת",
    initiatorsfullnames: "חברי הכנסת היוזמים",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api");
        const responseData = response.data as {
          query_result: { data: { rows: any[] } };
        };
        setData(responseData.query_result.data.rows);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [queryId]);

  useEffect(() => {
    const handleScroll = () => {
      if (openSquaresWithText) {
        setOpenSquaresWithText(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [openSquaresWithText]);

  if (loading) {
    return (
      <>
        <header className={`Component-header ${isShrunk ? `header-1-small` : `header-1-big`} ${headerNum === 4 ? "bottom-1-small" : "bottom-2-small"}`} id="Attendance-header">
          <a href="#Attendance-main">
            <h1>הצעות חוק</h1>
          </a>
        </header>
        <main className="Component-main" id="Schedule-main">
          <br />
          <br />
          <img src={"/LoadingFinal.gif"} alt="loading" className="loading-gif" />
          <br />
        </main>
      </>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedData = [...data].sort((a, b) => new Date(b.LastUpdatedDate).getTime() - new Date(a.LastUpdatedDate).getTime());

  const getInitiatorImage = (initiatorName: string) => {
    const initiator = Object.values(initiatorsData).find((entry: any) => entry.Name === initiatorName);
    return initiator ? initiator.MkImage : null;
  };

  const toggleDetails = (index: number) => {
    setOpenIndexes((prevState) => {
      const newState = new Set(prevState);
      if (newState.has(index)) {
        newState.delete(index);
      } else {
        newState.add(index);
      }
      return newState;
    });
  };

  const toggleSquaresWithText = () => {
    setOpenSquaresWithText(!openSquaresWithText);
  };

  return (
    <>
      <header className={`Component-header ${isShrunk ? `header-3-small` : `header-3-big`} ${headerNum === 4 ? `bottom-0-small` : `bottom-1-small`}`}>
        <a href="#LawSummary-main" className="header-link">
          <h1>הצעות חוק</h1>
        </a>
      </header>
      <main className="Component-main" id="LawSummary-main">
        <div className="law-header">
          <p>שם ההצעה</p>
          <div style={{ display: "flex" }}>
            <p style={{ marginLeft: "1rem" }}>סטטוס</p>
            <div className="law-blue-squere" onClick={toggleSquaresWithText} style={{ marginLeft: "6rem" }}>
              i
            </div>
          </div>

          {/* Popup that closes on scroll */}
          {openSquaresWithText && (
            <div className="modal-overlay-laws-info" onClick={toggleSquaresWithText}>
              <div className="popup">
                <SquaresWithText />
              </div>
            </div>
          )}
        </div>
        <section className="law-section">
          <div style={{ width: "100%", position: "relative" }}>
            <td className="law-horizontal-line"></td>
            <br />
          </div>
          <br />
          {sortedData.map((item, index) => (
            <div key={index} className="law-event-cell-opened">
              <details open={openIndexes.has(index)} onToggle={() => toggleDetails(index)}>
                <summary className={`law ${openIndexes.has(index) ? "open" : ""}`}>
                  <div className="law-content">
                    <div className="law-name">{item.billname}</div>
                    <SquareFillComponent text={item.statusdesc} />
                  </div>
                  <i className={`arrow ${openIndexes.has(index) ? "up" : "down"}`} />
                </summary>

                <div style={{ marginTop: "1rem" }}>
                  {Object.entries(item)
                    .filter(([key]) => key != "SummaryLaw" && key !== "billname" && key !== "statusdesc" && key !== "StatusID" && key !== "StartDate")
                    .map(([key, value]) => (
                      <p key={key} style={{ margin: "0.5rem 0" }}>
                        <p className="law-status">
                          {columnNames[key] || key}
                          <br />
                        </p>{" "}
                        <span className="law-value">
                          {key === "initiatorsfullnames"
                            ? value === null
                              ? "אין מידע על יוזמי.ות חוק זה"
                              : null
                            : (value as string)}
                        </span>
                      </p>
                    ))}

                  {item.initiatorsfullnames && (
                    <div className="grid-content">
                      {item.initiatorsfullnames.split(",").map((name: string) => {
                        const imageUrl = getInitiatorImage(name.trim());
                        return (
                          <div key={name} className="grid-item">
                            {imageUrl && <img src={imageUrl} alt={name} />}
                            <div className="law-value">{name}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </details>
              <div style={{ width: "100%", position: "relative" }}>
                <br />
                <td className="law-horizontal-line"></td>
                <br />
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
};

export default LawSummary;
