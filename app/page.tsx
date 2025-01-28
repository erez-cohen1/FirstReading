"use client";
import Schedule from "./Components/Schedule/Schedule";
import Votes from "./Components/Votes";
import DateSelector from "./Components/Date/dateSelector";
import KnessetAttendance from "./Components/Attendence/KnessetAttendance";
import DateComponent from "./Components/Date/Date";
import LawSummary from "./Components/LawSummary";
import DailyInfo from "./Components/DailyInfo/DailyInfo";
import { useEffect, useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date(Date.now()));
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsShrunk(scrollY > 90); // Shrink if scrolled down 50px or more
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <main className="main-page">
      <section className={`${isShrunk ? "main-header-small" : "main-header-big"} header-0`}>
        <h1>
          קריאה {!isShrunk && <br />}
          ראשונה
        </h1>
        <section className="Date">
          <DateComponent date={date}></DateComponent>
          <DateSelector date={date} setDate={setDate}></DateSelector>
          <hr />
        </section>
      </section>
      <KnessetAttendance isShrunk={isShrunk} date={date} />
      {/* <div className="hidden-div"></div> */}
      <Schedule date={date} isShrunk={isShrunk}></Schedule>
      <LawSummary queryId={1433} isShrunk={isShrunk}></LawSummary>
      {/* <LawCount></LawCount> */}
      <Votes date={date} isShrunk={isShrunk}></Votes>
      <DailyInfo isShrunk={isShrunk}></DailyInfo>
    </main>
  );
}
