"use client";

import React, { useState, useEffect } from "react";
import mkDetails from "./mkDetails.json";

interface MkData {
  MkId: number;
  IsPresent: boolean;
  Name: string;
  MkImage: string;
}

const KnessetAttendance: React.FC = () => {
  const [mkData, setMkData] = useState<MkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const fetchAttendanceData = async () => {
    try {
      // Fetch attendance data
      const attendanceResponse = await fetch(
        "https://knesset.gov.il/WebSiteApi/knessetapi/MkLobby/GetMkPresent?lang=he"
      );
      if (!attendanceResponse.ok) {
        throw new Error(
          `Attendance API error: ${attendanceResponse.status}`
        );
      }

      const attendanceData: { MkId: number; IsPresent: boolean }[] =
        await attendanceResponse.json();

      const existingIds = new Set(Object.keys(mkDetails).map(Number)); // Convert keys to numbers
      const missingData = attendanceData.filter(((mk) => !(mkDetails as { [key: string]: { Name: string; MkImage: string } })[mk.MkId.toString()]));

      // Fetch details for each MkId with concurrency limit
      const concurrencyLimit = 10; // Number of simultaneous requests
      const detailedData = attendanceData.filter(((mk) => (mkDetails as { [key: string]: { Name: string; MkImage: string } })[mk.MkId.toString()])).map((mk) => ({
        MkId: mk.MkId,
        IsPresent: mk.IsPresent,
        Name: (mkDetails as { [key: string]: { Name: string; MkImage: string } })[mk.MkId.toString()]?.Name,
        MkImage: (mkDetails as { [key: string]: { Name: string; MkImage: string } })[mk.MkId.toString()]?.MkImage
      }));
      const queue: Promise<void>[] = [];

      for (const mk of missingData) {
        const fetchMkDetails = async () => {
          try {
            const detailsResponse = await fetch(
              `https://knesset.gov.il/WebSiteApi/knessetapi/MKs/GetMkdetailsHeader?mkId=${mk.MkId}&languageKey=he`
            );
            if (!detailsResponse.ok) {
              throw new Error(
                `Details API error for MkId ${mk.MkId}: ${detailsResponse.status}`
              );
            }

            const details = await detailsResponse.json();

            detailedData.push({
              MkId: mk.MkId,
              IsPresent: mk.IsPresent,
              Name: details.Name,
              MkImage: details.MkImage
            });
          } catch (error) {
            detailedData.push({
              MkId: mk.MkId,
              IsPresent: mk.IsPresent,
              Name: String(mk.MkId),
              MkImage: String(mk.MkId)
            });
            console.error(`Failed to fetch details for MkId ${mk.MkId}:`, error);
          }
        };

        // Add the request to the queue
        const task = fetchMkDetails();
        queue.push(task);

        // Wait if concurrency limit is reached
        if (queue.length >= concurrencyLimit) {
          await Promise.race(queue);
          queue.splice(0, queue.findIndex((t) => t === task) + 1); // Remove resolved tasks
        }
      }

      // Wait for all remaining requests to complete
      await Promise.all(queue);

      // Sort data so that present members come first
      const sortedData = detailedData.sort((a, b) => (b.IsPresent ? 1 : 0) - (a.IsPresent ? 1 : 0));
      setMkData(detailedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Count present and absent members
  const presentCount = mkData.filter(mk => mk.IsPresent).length;
  const absentCount = mkData.length - presentCount;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Knesset Attendance</h1>

      {/* Button to show number of present/absent members */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Show Attendance (Present: {presentCount})
        </button>
      </div>

      {/* Modal window showing the full list of members in table format */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2>Attendance List</h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px" }}>Image</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mkData.map((mk) => (
                  <tr key={mk.MkId} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>
                      <img
                        src={mk.MkImage}
                        alt={mk.Name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td style={{ padding: "10px" }}>{mk.Name}</td>
                    <td
                      style={{
                        padding: "10px",
                        color: mk.IsPresent ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {mk.IsPresent ? "Present" : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                marginTop: "20px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnessetAttendance;
