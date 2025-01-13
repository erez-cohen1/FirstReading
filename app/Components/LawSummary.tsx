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
  const [showAll, setShowAll] = useState<boolean>(false);

  const columnNames: Record<string, string> = {
    Name: "שם החוק",
    SummaryLaw: "תקציר החוק",
    StartDate: "תאריך הדיון האחרון",
    statusdesc: "סטטוס",
    FirstName: "שם פרטי",
    LastName: "שם משפחה",
    billname: "שם החוק",
    committeename: "שם הוועדה",
    initiatorsfullnames: "יוזמה של",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api"); 
        const responseData = response.data as { query_result: { data: { rows: any[] } } };
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

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.LastUpdatedDate).getTime() - new Date(a.LastUpdatedDate).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("he-IL")} ${date.toLocaleTimeString(
      "he-IL",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  const displayedData = showAll ? sortedData : sortedData.slice(0, 3);

  const getInitiatorImage = (initiatorName: string) => {
    const initiator = Object.values(initiatorsData).find(
      (entry: any) => entry.Name === initiatorName
    );
    return initiator ? initiator.MkImage : null;
  };
  return (
    <>
      <div className="Component" id="Schedule">
        <header className="Component-header">
          <h1>הצעות חוק</h1>
        </header>
        <main className="Component-main">
          <section className="Schedule-section" id="General-Assembly">
            {displayedData.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                }}
              >
                {Object.entries(item)
                  .filter(([key, value]) => value !== null && key !== "StatusID")
                  .map(([key, value]) => (
                    <p key={key} style={{ margin: "0.5rem 0" }}>
                      <strong>{columnNames[key] || key}:</strong>{" "}
                      {key === "StartDate"
                        ? formatDate(value as string)
                        : (value as string)}
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
                                width: "10rem", 
                                height: "10rem", 
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
            ))}
          </section>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "0.1rem",
              cursor: "pointer",
              margin: "1rem auto",
              display: "block",
            }}
          >
            {showAll ? "הצג פחות" : "הצג הכל"}
          </button>
        </main>
      </div>
    </>
  );
};

export default LawSummary;
