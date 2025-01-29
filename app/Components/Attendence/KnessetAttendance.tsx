import React, { useState, useEffect, useRef } from "react";
import AttendanceChart from "./AttendanceChart";
import DisplayOptions from "./DisplayOptions";
import NonMkChart from "./NonMkChart";
import Modal from "./Modal";
import { useAttendanceData } from "./useAttendanceData";
//import { useAttendanceDataFromFile } from "./useAttendanceData";
import { MkData } from "./MkData";

interface KnessetAttendanceProps {
  date: Date;
  isShrunk: boolean;
  headerNum: number;
}

const KnessetAttendance: React.FC<KnessetAttendanceProps> = ({ date, isShrunk, headerNum }) => {
  const [mkData, loading, error] = useAttendanceData();
  const [displayOption, setDisplayOption] = useState<"all" | "coalition" | "opposition" | "goverment">("all");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = headerRef.current;
      if (header) {
        document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Handle modal opening and closing with smooth scroll
  const handleToggleModal = () => {
    if (showModal) {
      // If modal is currently open, first scroll it to the top, then close it
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

        // Delay closing the modal to allow the scroll to complete
        setTimeout(() => {
          setShowModal(false); // Now close the modal
        }, 800); // Adjust this time to match your scroll duration
      }
    } else {
      // If modal is closed, open it
      setShowModal(true);
    }
  };

  if (loading) return <div className="Component">Loading...</div>;
  if (error) return <div className="Component">Error: {error}</div>;

  return (
    <>
      <header
        className={`Component-header ${isShrunk ? `header-${headerNum}-small` : `header-${headerNum}-big`}`}
        id="Attendance-header"
      >
        <a href="#Attendance-main" className="header-link">
          <h1>נוכחות חברי כנסת</h1>
        </a>
      </header>
      <main className="Component-main" id="Attendance-main">
        <DisplayOptions mkData={mkData} displayOption={displayOption} setDisplayOption={setDisplayOption} modalRef={modalRef} />
        <AttendanceChart mkData={mkData} displayOption={displayOption} />
        {/* <NonMkChart mkData={mkData} govData={govData} displayOption={displayOption} modalRef={modalRef} /> */}
        <div
          className={`Component-footer attendance ${showModal ? "modal-active" : ""} ${
            isShrunk ? "" : "footer-big-header-stick"
          }`}
          onClick={() => handleToggleModal()}
        >
          <div className="footer-text">לרשימה המלאה</div>
          <i className={`arrow footer-arrow ${showModal ? "up" : "down"}`}></i>
        </div>
        <Modal mkData={mkData} displayOption={displayOption} showModal={showModal} modalRef={modalRef} />
      </main>
    </>
  );
};

export default KnessetAttendance;
