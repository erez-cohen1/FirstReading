"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);
  

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
      const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      } 
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  // Count present and absent members
  const presentCount = mkData.filter(mk => mk.IsPresent).length;
  const absentCount = mkData.length - presentCount;

  if (loading) return <div className="Component">Loading...</div>;
  if (error) return <div className="Component">Error: {error}</div>;

  return (
    <div className="attendance-component" id="KnessetAttendance">
      <header className="Component-header">
        <h1>נוכחות חכים היום</h1>
        <a
          href="#"
          className="share-icon"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <img src="Share-icon.png" alt="Share" />
        </a>
      </header>
      <main className="Component-main" style={{ height: "auto" }}>
        <div className="attendance-chart">
          <div className="chart-wrapper">
            {mkData.map((mk) => (
              <div
                key={mk.MkId}
                className={`chart-circle ${mk.IsPresent ? "present" : "absent"}`}
              ></div>
            ))}
          </div>
          <div className="attendance-summary">
            <span className="present-count">{presentCount}</span>/
            <span className="total-count">{mkData.length}</span>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content Component" ref={modalRef}>
              <button
                  onClick={() => setShowModal(false)}
                  className="close-modal-button"
                >
                Close
              </button>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mkData.map((mk) => (
                    <tr key={mk.MkId}>
                      <td>
                        <img
                          src={mk.MkImage}
                          alt={mk.Name}
                          className="mk-image"
                        />
                      </td>
                      <td>{mk.Name}</td>
                      <td className={mk.IsPresent ? "present" : "absent"}>
                        {mk.IsPresent ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <footer className="Component-footer">
        <a href="#" className="expand-component">
          <p>לרשימה המלאה</p>
          <img src="Schedule-arrow.png" alt="Expand" 
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}/>
        </a>
      </footer>
    </div>
  );
};


export default KnessetAttendance;
