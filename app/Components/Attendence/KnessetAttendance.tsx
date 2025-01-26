import React, { useState, useEffect, useRef } from "react";
import AttendanceChart from "./AttendanceChart";
import DisplayOptions from "./DisplayOptions";
import Modal from "./Modal";
import { useAttendanceData } from "./useAttendanceData";
import { MkData } from "./MkData";

const KnessetAttendance: React.FC = () => {
  const [mkData, loading, error] = useAttendanceData();
  const [displayOption, setDisplayOption] = useState<"all" | "coalition" | "opposition" | "goverment">("all");
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div className="Component">Loading...</div>;
  if (error) return <div className="Component">Error: {error}</div>;

  return (
    <>
      <header className="Component-header header-0" id="Attendance-header">
        <a href="#Attendance-main">
          <h1>נוכחות חכים</h1>
        </a>
      </header>
      <main className="Component-main" id="Attendance-main">
        <AttendanceChart mkData={mkData} displayOption={displayOption} />
        <DisplayOptions mkData={mkData} displayOption={displayOption} setDisplayOption={setDisplayOption} />
        <div className="Component-footer attendance">
          <div>לרשימה המלאה</div>
          <i className={`arrow ${showModal ? "up" : "down"}`} onClick={() => setShowModal(!showModal)}></i>
        </div>
        {showModal && <Modal mkData={mkData} displayOption={displayOption} setShowModal={setShowModal} />}
      </main>
    </>
  );
};

export default KnessetAttendance;
