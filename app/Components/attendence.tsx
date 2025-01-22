"use client";

import React, { useState, useEffect, useRef } from "react";

export interface MkData {
  MkId: number;
  IsPresent: boolean;
  IsCoalition: boolean;
  Name: string;
  MkImage: string;
  FactionName: string;
  Phone: string;
  isGoverment: boolean;
}

const KnessetAttendance: React.FC = () => {
  const [mkData, setMkData] = useState<MkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [displayOption, setDisplayOption] = useState<"all" | "coalition" | "opposition" | "goverment">("all");
  const modalRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [isArrowVisible, setIsArrowVisible] = useState(true);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (compRef.current && arrowRef.current) {
      const footerBounds = compRef.current.getBoundingClientRect();
      const arrowBounds = arrowRef.current.getBoundingClientRect();

      // Check if the arrow is within the bounds of the footer
      const isWithinFooter =
        arrowBounds.bottom <= footerBounds.bottom &&
        arrowBounds.top >= footerBounds.top &&
        arrowBounds.left >= footerBounds.left &&
        arrowBounds.right <= footerBounds.right;

      // Update visibility state based on position
      setIsArrowVisible(isWithinFooter);
    }
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      // Cleanup listener on unmount
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFlip = (id: number) => {
    setFlippedId(flippedId === id ? null : id); // Toggle the flip state
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch("https://knesset.gov.il/WebSiteApi/knessetapi/MkLobby/GetMkLobbyData?lang=he");
      if (!response.ok) {
        throw new Error(`Attendance API error: ${response.status}`);
      }

      const data = await response.json();

      const formattedData = data.mks.map((mk: any) => ({
        MkId: mk.MkId,
        IsPresent: mk.IsPresent,
        IsCoalition: mk.IsCoalition,
        Name: `${mk.Firstname} ${mk.Lastname}`,
        MkImage: mk.ImagePath,
        FactionName: mk.FactionName,
        Phone: mk.Phone,
        isGoverment: data.governmentPositions.some((position: any) => position.IsMk && position.MkId === mk.MkId),
      }));

      const sortedData = formattedData.sort((a: MkData, b: MkData) => (b.IsPresent === a.IsPresent ? 0 : b.IsPresent ? 1 : -1));

      setMkData(formattedData);
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

  const getCounts = () => {
    const coalition = mkData.filter((mk) => mk.IsCoalition);
    const opposition = mkData.filter((mk) => !mk.IsCoalition);
    const goverment = mkData.filter((mk) => mk.isGoverment);

    return {
      coalitionPresent: coalition.filter((mk) => mk.IsPresent).length,
      coalitionAbsent: coalition.filter((mk) => !mk.IsPresent).length,
      oppositionPresent: opposition.filter((mk) => mk.IsPresent).length,
      oppositionAbsent: opposition.filter((mk) => !mk.IsPresent).length,
      govermentPresent: goverment.filter((mk) => mk.IsPresent).length,
      govermentAbsent: goverment.filter((mk) => !mk.IsPresent).length,
    };
  };

  const counts = getCounts();

  const filteredData =
    displayOption === "coalition"
      ? mkData.filter((mk) => mk.IsCoalition)
      : displayOption === "opposition"
      ? mkData.filter((mk) => !mk.IsCoalition)
      : displayOption == "goverment"
      ? mkData.filter((mk) => mk.isGoverment)
      : mkData;

  const presentCount = filteredData.filter((mk) => mk.IsPresent).length;

  if (loading) return <div className="Component">Loading...</div>;
  if (error) return <div className="Component">Error: {error}</div>;

  return (
    <div className="Component" style={{ position: "relative", height: "100%" }} id="KnessetAttendance" ref={compRef}>
      <header className="Component-header">
        <h1>נוכחות חכים</h1>
      </header>
      <main className="Component-main" style={{ height: "auto" }}>
        <div className="attendance-chart">
          <div className="chart-wrapper">
            {mkData
              .slice() // Create a shallow copy of the data
              .sort((a, b) => {
                if (displayOption === "coalition") {
                  // Sort coalition members first
                  if (a.IsCoalition !== b.IsCoalition) return b.IsCoalition ? 1 : -1;
                } else if (displayOption === "opposition") {
                  // Sort opposition members first
                  if (a.IsCoalition !== b.IsCoalition) return b.IsCoalition ? -1 : 1;
                } else if (displayOption === "goverment") {
                  // Sort opposition members first
                  if (a.isGoverment !== b.isGoverment) return b.isGoverment ? 1 : -1;
                }
                // Sort within each group by presence
                return b.IsPresent === a.IsPresent ? 0 : b.IsPresent ? 1 : -1;
              })
              .map((mk) => {
                const isMatchingOption =
                  (displayOption === "coalition" && mk.IsCoalition) ||
                  (displayOption === "opposition" && !mk.IsCoalition) ||
                  (displayOption === "goverment" && mk.isGoverment) ||
                  displayOption === "all";

                return (
                  <div
                    key={mk.MkId}
                    className={`chart-circle ${mk.IsPresent ? "present" : "absent"} ${isMatchingOption ? "" : "dimmed"}`}
                  ></div>
                );
              })}
          </div>

          <div className="display-options">
            <button onClick={() => setDisplayOption("goverment")} className={displayOption === "goverment" ? "active" : ""}>
              <p>ממשלה</p>
              <div>
                <span>{counts.govermentPresent}</span>/<span>{counts.govermentPresent + counts.govermentAbsent}</span>
              </div>
            </button>
            <button onClick={() => setDisplayOption("coalition")} className={displayOption === "coalition" ? "active" : ""}>
              <p>קואליציה</p>
              <div>
                <span>{counts.coalitionPresent}</span>/<span>{counts.coalitionAbsent + counts.coalitionPresent}</span>
              </div>
            </button>
            <button onClick={() => setDisplayOption("opposition")} className={displayOption === "opposition" ? "active" : ""}>
              <p>אופוזיציה</p>
              <div>
                <span>{counts.oppositionPresent}</span>/<span>{counts.oppositionAbsent + counts.oppositionPresent}</span>
              </div>
            </button>
            <button onClick={() => setDisplayOption("all")} className={displayOption === "all" ? "active" : ""}>
              <p>במשכן</p>
              <div>
                <span>{counts.oppositionPresent + counts.coalitionPresent}</span>/<span>{mkData.length}</span>
              </div>
            </button>
          </div>
        </div>
      </main>
      <div className="Component-footer attendance" ref={footerRef}>
        <div>לרשימה המלאה</div>
        {!showModal && (<i className="arrow down"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
        </i>)}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content Component" ref={modalRef}>
            <div
              ref={arrowRef}
              className={`arrow up fixed-arrow ${isArrowVisible ? "visible" : "hidden"}`}
              onClick={() => {
                setShowModal(false); // Close the modal
                window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
              }}
            ></div>
              <div className="attendance-grid">
                <div className="grid-content">
                  {filteredData.map((mk) => (
                    <div
                      className={`grid-item ${flippedId === mk.MkId ? "flipped" : ""}`}
                      key={mk.MkId}
                      onClick={() => handleFlip(mk.MkId)}
                    >
                      {flippedId === mk.MkId ? (
                        <div className="mk-info">
                          <div className="mk-name">{mk.Name}</div>
                          <div className="mk-name">{mk.FactionName}</div>
                          <div className="mk-name">{mk.Phone}</div>
                        </div>
                      ) : (
                        <>
                          <img src={mk.MkImage} alt={mk.Name} className={`mk-image ${mk.IsPresent ? "" : "grayscale"}`} />
                          <div className="mk-name">{mk.Name}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnessetAttendance;
