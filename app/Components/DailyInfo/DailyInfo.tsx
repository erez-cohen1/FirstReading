"use client";

import { useRef, useState } from "react";
import useIsVisible from "../Schedule/useIsVisible";
import PhraseComp from "./PhraseComp";
import DailyCheck from "./DailyCheck";

export default function DailyInfo({ isShrunk }: { isShrunk: boolean }) {
  const [loading, setLoading] = useState(false);
  const summaryRef = useRef<HTMLTableCellElement | null>(null);
  const isVisible = useIsVisible(summaryRef);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.currentTarget as HTMLDetailsElement;
    //closing the element
    if (!target.open && !isVisible) {
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (target.open) {
      // opening the element
      const detailsList: NodeListOf<HTMLDetailsElement> = document.querySelectorAll("details");
      // Close all other details elements.
      detailsList.forEach((details) => {
        if (details.textContent != target.textContent) {
          details.open = false;
        }
      });
    }
  };

  const phrases = [
    "​חבר הכנסת רשאי לפנות לשר בשאילתה על עניין שבתחום תפקידי השר הנשאל. יש שלושה סוגי שאילתות: שאילתה רגילה, שאילתה בעל-פה ושאילתה ישירה.",
    "​חבר הכנסת רשאי לפנות לשר בשאילתה על עניין שבתחום תפקידי השר הנשאל. יש שלושה סוגי שאילתות: שאילתה רגילה, שאילתה בעל-פה ושאילתה ישירה.",
  ];
  if (loading) {
    return (
      <>
        <header className={`Component-header ${isShrunk ? "header-5-small" : "header-5-big"}`} id="Schedule-header">
          <a href="#DailyInfo-main">
            <h1>הידעת?</h1>
          </a>
        </header>
        <main className="Component-main" id="DailyInfo-main">
          <br />
          <h3 style={{ textAlign: "center" }}>...</h3>
          <br />
        </main>
      </>
    );
  }
  return (
    <>
      <header className={`Component-header ${isShrunk ? "header-5-small" : "header-5-big"}`} id="Schedule-header">
        <a href="#DailyInfo-main" className="header-link">
          <h1>הידעת?</h1>
        </a>
      </header>
      <main className="info-main" id="DailyInfo-main">
        <table className="info-table">
          <tbody className={`info-table-body showAll}`}>
            <DailyCheck isShrunk={isShrunk} index={0} content={phrases[0]} name="שאילתה"></DailyCheck>
            <DailyCheck isShrunk={isShrunk} index={1} content={phrases[1]} name="משכן הכנסת"></DailyCheck>
          </tbody>
        </table>
      </main>
      {/* <main className="DailyInfo-main" id="DailyInfo-main">
        <PhraseComp name={"בדיקה"} content={phrases[0]}></PhraseComp>
        <div className="Schedule-horizontal-line daily-info-line"></div>
        <div className="schedule-event-cell-opened" id="DailyInfo-expand">
          <details>
            <summary>
              <div>
                <h2>למילון המונחים</h2>
              </div>
              <i className="arrow down white"></i>
            </summary>
            {phrases.map((phrase, index) => (
              <>
                <div className="Schedule-horizontal-line daily-info-line"></div>
                <PhraseComp name={"בדיקה"} content={phrase} key={index}></PhraseComp>
              </>
            ))}
          </details>
        </div>
        <div className="Schedule-horizontal-line daily-info-line"></div>
      </main> */}
    </>
  );
}
