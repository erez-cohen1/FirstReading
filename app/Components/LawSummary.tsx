"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import initiatorsData from "./mkDetails.json"; // Adjust the path as needed

interface LawSummaryProps {
  queryId: number;
}

const LawSummary: React.FC<LawSummaryProps> = ({ queryId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set()); // Tracks open items
  const [showMore, setShowMore] = useState<boolean>(false); // Track if "Show more" is clicked

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedData = [...data].sort((a, b) => new Date(b.LastUpdatedDate).getTime() - new Date(a.LastUpdatedDate).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("he-IL")} ${date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const getInitiatorImage = (initiatorName: string) => {
    const initiator = Object.values(initiatorsData).find((entry: any) => entry.Name === initiatorName);
    return initiator ? initiator.MkImage : null;
  };

  // Toggle open/closed state for a specific item
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

  return (
    <div className="Component" id="Schedule">
      <header className="Component-header">
        <h1>הצעות חוק</h1>
      </header>
      <main className="Component-main">
        <section className="Schedule-section" id="General-Assembly">
          {sortedData.slice(0, 6).map((item, index) => (
            <details
              key={index}
              open={openIndexes.has(index)} // Set open state based on the index
              onToggle={() => toggleDetails(index)} // Toggle open/close when clicked
            >
              <summary
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <span>
                  {item.billname}
                  <br />
                  {item.statusdesc}
                </span>
                <i
                  className={`arrow ${openIndexes.has(index) ? "up" : "down"}`} // Rotate the arrow based on the state
                  style={{
                    transition: "transform 0.3s",
                    transform: openIndexes.has(index) ? "rotate(-135deg)" : "rotate(45deg)", // Rotate the arrow when opened
                  }}
                />
              </summary>
              <div style={{ marginTop: "10px" }}>
                {Object.entries(item)
                  .filter(([key, value]) => value !== null && key !== "billname" && key !== "statusdesc" && key !== "StatusID" && key !== "StartDate")
                  .map(([key, value]) => (
                    <p key={key} style={{ margin: "0.5rem 0" }}>
                      <strong
                        style={{
                          color: "#FF6700", // Apply custom color
                          fontFamily: "VC Narkis Block, sans-serif", // Apply custom font
                        }}
                      >
                        {columnNames[key] || key}
                        <br />
                      </strong>{" "}
                      {key === "initiatorsfullnames" ? null : (key === "StartDate" ? formatDate(value as string) : (value as string))}                    </p>
                  ))}
                {/* Render initiator images */}
                {item.initiatorsfullnames && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {item.initiatorsfullnames.split(",").map((name: string) => {
                      const imageUrl = getInitiatorImage(name.trim());
                      return (
                        <div
                          key={name}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            maxWidth: "calc(25% - 0.5rem)",
                          }}
                        >
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={name}
                              style={{
                                width: "6rem",
                                height: "6rem",
                                objectFit: "cover", // Ensures content fits without distortion
                              }}
                            />
                          )}
                          <p style={{ margin: "0.1rem 0", fontSize: "1rem" }}>{name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </details>
          ))}
          
          {!showMore && (
            <details
              open={false}
              onClick={() => setShowMore(true)} // Show more when clicked
            >
              <summary
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <span>
                  לרשימה המלאה
                </span>
                <i
                  className={`arrow ${showMore ? "up" : "down"}`} 
                  style={{
                    transition: "transform 0.3s",
                    transform: showMore ? "rotate(-135deg)" : "rotate(45deg)", 
                  }}
                />
              </summary>
            </details>
          )}

          {showMore && sortedData.slice(6).map((item, index) => (
            <details
              key={index + 6} // Ensure unique keys
              open={openIndexes.has(index + 6)}
              onToggle={() => toggleDetails(index + 6)}
            >
              <summary
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <span>
                  {item.billname}
                  <br />
                  {item.statusdesc}
                </span>
                <i
                  className={`arrow ${openIndexes.has(index + 6) ? "up" : "down"}`}
                  style={{
                    transition: "transform 0.3s",
                    transform: openIndexes.has(index + 6) ? "rotate(-135deg)" : "rotate(45deg)",
                  }}
                />
              </summary>
              <div style={{ marginTop: "10px" }}>
                {Object.entries(item)
                  .filter(([key, value]) => value !== null && key !== "billname" && key !== "statusdesc" && key !== "StatusID" && key !== "StartDate")
                  .map(([key, value]) => (
                    <p key={key} style={{ margin: "0.5rem 0" }}>
                      <strong
                        style={{
                          color: "#FF6700", // Apply custom color
                          fontFamily: "VC Narkis Block, sans-serif", // Apply custom font
                        }}
                      >
                        {columnNames[key] || key}
                        <br />
                      </strong>{" "}
                      {key === "StartDate" ? formatDate(value as string) : (value as string)}
                    </p>
                  ))}
                {/* Render initiator images */}
                {item.initiatorsfullnames && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {item.initiatorsfullnames.split(",").map((name: string) => {
                      const imageUrl = getInitiatorImage(name.trim());
                      return (
                        <div
                          key={name}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            maxWidth: "calc(25% - 0.5rem)",
                          }}
                        >
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={name}
                              style={{
                                width: "6rem",
                                height: "6rem",
                                objectFit: "cover", // Ensures content fits without distortion
                              }}
                            />
                          )}
                          <p style={{ margin: "0.1rem 0", fontSize: "1rem" }}>{name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
};

export default LawSummary;
