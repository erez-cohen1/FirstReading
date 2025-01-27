"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import initiatorsData from "./mkDetails.json";
import SquareFillComponent from "./LawStatusSqueres";
interface LawSummaryProps {
  queryId: number;
}

const LawSummary: React.FC<LawSummaryProps> = ({ queryId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set()); // Tracks open items

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

  const sortedData = [...data].sort(
    (a, b) => new Date(b.LastUpdatedDate).getTime() - new Date(a.LastUpdatedDate).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("he-IL")} ${date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const getInitiatorImage = (initiatorName: string) => {
    const initiator = Object.values(initiatorsData).find(
      (entry: any) => entry.Name === initiatorName
    );
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

  return (
    <>
      <header className="Component-header header-2">
        <a href="#LawSummary-main">
          <h1>הצעות חוק</h1>
        </a>
      </header>
      <main className="Component-main" id="LawSummary-main">
      <section className="law-section" id="General-Assembly">
      {sortedData.map((item, index) => (
      <div key={index} className="schedule-event-cell-opened">
        <details
          open={openIndexes.has(index)} // Set open state based on the index
          onToggle={() => toggleDetails(index)} // Toggle open/close when clicked
        >
          
        <summary className={`law ${openIndexes.has(index) ? "open" : ""}`}>
          <div className="law-content">
            <div className="law-name">
              {item.billname}
            </div>
            {/* <div className="law-status">
              {item.statusdesc}
            </div> */}
            <SquareFillComponent text={item.statusdesc} />
          </div>
          <i className={`arrow ${openIndexes.has(index) ? "up" : "down"}`} />
          
        </summary>

        <div style={{ marginTop: "10px" }}>
          {Object.entries(item)
            .filter(([key, value]) => value !== null && key !== "billname" && key !== "statusdesc" && key !== "StatusID" && key !== "StartDate")
            .map(([key, value]) => (
              <p key={key} style={{ margin: "0.5rem 0" }}>
                <p className="law-status">
                  {columnNames[key] || key}
                  <br/>
                </p>{" "}
                {key === "initiatorsfullnames"
                  ? null
                  : key === "StartDate"
                  ? formatDate(value as string)
                  : (value as string)}
              </p>
            ))}
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
      <br></br>
      <td className="law-horizontal-line"> </td>
      <br></br>
    </div>
  ))}
</section>
      </main>
    </>
  );
};

export default LawSummary;
