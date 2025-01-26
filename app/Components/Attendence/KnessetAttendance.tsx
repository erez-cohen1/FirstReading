import React, { useState, useEffect, useRef } from "react";
import AttendanceChart from "./AttendanceChart";
import DisplayOptions from "./DisplayOptions";
import Modal from "./Modal";
//import { useAttendanceData } from "./useAttendanceData";
import { useAttendanceDataFromFile } from "./useAttendanceData";
import { MkData } from "./MkData";

const KnessetAttendance: React.FC = () => {
  const [mkData, loading, error] = useAttendanceDataFromFile();
  const [displayOption, setDisplayOption] = useState<"all" | "coalition" | "opposition" | "goverment">("all");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
      <header className="Component-header header-0" id="Attendance-header">
        <h1>נוכחות חברי כנסת</h1>
      </header>
      <main className="Component-main" id="Attendance-main">
        <DisplayOptions mkData={mkData} displayOption={displayOption} setDisplayOption={setDisplayOption} />
        <AttendanceChart mkData={mkData} displayOption={displayOption} modalRef={modalRef} />
        <div className={`Component-footer attendance ${showModal ? "modal-active" : ""}`}>
          <div className="footer-text">לרשימה המלאה</div>
          <i className={`arrow footer-arrow ${showModal ? "up" : "down"}`} onClick={() => handleToggleModal()}></i>
        </div>
        <Modal mkData={mkData} displayOption={displayOption} showModal={showModal} modalRef={modalRef} />
      </main>
    </>
  );
};

export default KnessetAttendance;
