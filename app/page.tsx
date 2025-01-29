"use client";
import Schedule from "./Components/Schedule/Schedule";
import Votes from "./Components/Votes";
import DateSelector from "./Components/Date/dateSelector";
import KnessetAttendance from "./Components/Attendence/KnessetAttendance";
import DateComponent from "./Components/Date/Date";
import LawSummary from "./Components/LawSummary";
import DailyInfo from "./Components/DailyInfo/DailyInfo";
import Credits from "./Components/Credits/Credits";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date(Date.now()));
  const [isShrunk, setIsShrunk] = useState(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // console.log(isShrunk);
      if (!isShrunk) {
        setIsShrunk(scrollY > 10); // Shrink if scrolled down 50px or more
      } else if (scrollY < 30) {
        setIsShrunk(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isShrunk]);

  const stickyHeadersNum = date.toDateString() != new Date(Date.now()).toDateString() ? 5 : 4;
  return (
    <>
      <header className={`${isShrunk ? "main-header-small" : "main-header-big"} header-0`} id="top" ref={topRef}>
        <a href="#top">
          <h1>
            קריאה {!isShrunk && <br />}
            ראשונה
          </h1>
        </a>
        <section className="Date">
          <DateComponent date={date}></DateComponent>
          <DateSelector date={date} setDate={setDate} topRef={topRef}></DateSelector>
          <hr />
        </section>
      </header>
      <main className="main-page" onClick={() => setIsShrunk(true)}>
        <KnessetAttendance
          headerNum={stickyHeadersNum == 5 ? stickyHeadersNum - 3 : stickyHeadersNum}
          isShrunk={isShrunk}
          date={date}
        />
        {/* <div className="hidden-div"></div> */}
        <Schedule
          headerNum={stickyHeadersNum == 5 ? stickyHeadersNum - 2 : stickyHeadersNum}
          date={date}
          isShrunk={isShrunk}
        ></Schedule>
        <LawSummary
          headerNum={stickyHeadersNum == 5 ? stickyHeadersNum - 1 : stickyHeadersNum}
          queryId={1433}
          isShrunk={isShrunk}
        ></LawSummary>
        {/* <Votes date={date} isShrunk={isShrunk}></Votes> */}
        {date.toDateString() != new Date(Date.now()).toDateString() && (
          <Votes date={date} headerNum={stickyHeadersNum} isShrunk={isShrunk}></Votes>
        )}
        <DailyInfo headerNum={stickyHeadersNum} isShrunk={isShrunk}></DailyInfo>
        {/* <DailyInfo headerNum={date.toDateString() != new Date(Date.now()).toDateString() ? 5 : 4} isShrunk={isShrunk}></DailyInfo> */}
        <Credits></Credits>
      </main>
    </>
  );
}
