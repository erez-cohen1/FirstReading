"use client";

import { useEffect, useRef, useState } from "react";
import useIsVisible from "../Schedule/useIsVisible";
import PhraseComp from "./PhraseComp";
import termsList from "./termsList.json";
import AllPhrasesComp from "./AllPhrases";

export interface Term {
  term: string;
  explanation: string;
}

export default function DailyInfo({ headerNum, isShrunk }: { headerNum: number; isShrunk: boolean }) {
  const [loading, setLoading] = useState(false);
  const [phrases, setPhrases] = useState<Term[]>([]);
  const summaryRef = useRef<HTMLTableCellElement | null>(null);
  const isVisible = useIsVisible(summaryRef);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const phrasesFetch: Term[] = await termsList;
      setPhrases(phrasesFetch);
    }
    fetchData();
    setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <>
        <header className={`Component-header`} id="DailyInfo-header">
          <a href="#Info-main">
            <h1>הידעת?</h1>
          </a>
        </header>
        <main className="Component-main" id="Info-main">
          <br />
          {/* <img src={"/basic_loading_gif.gif"} alt="loading" className="loading-gif" /> */}
          {/* <h3 style={{ textAlign: "center" }}>טוען את סדר היום...</h3> */}
          <img src={"/LoadingFinal.gif"} alt="loading" className="loading-gif" />

          <br />
        </main>
      </>
    );
  }
  return (
    <>
      <header className={`Component-header`} id="DailyInfo-header">
        <a href="#DailyInfo-main" className="header-link">
          <h1>הידעת?</h1>
        </a>
      </header>
      <main className="info-main" id="DailyInfo-main">
        <table className="info-table">
          <tbody className={`info-table-body showAll}`}>
            {/* <PhraseComp isShrunk={isShrunk} index={0} content={phrases[0]?.explanation} name={phrases[0]?.term}></PhraseComp> */}
            <tr className="info-event-row">
              <td className="info-event-cell-opened" ref={summaryRef} id="info-event-cell">
                <details open onToggle={handleToggle}>
                  <summary className="info-event-summary">
                    <div className="info-event-title">
                      <h3>{phrases[0]?.term}</h3>
                    </div>
                    <i className="arrow down white"></i>
                  </summary>
                  <p>{phrases[0]?.explanation}</p>
                </details>
              </td>
            </tr>
            <tr>
              <td className="info-table-horizontal-separator" id="info-table-horizontal-separator">
                <div className="daily-info-line"></div>
              </td>
            </tr>
            <AllPhrasesComp phrases={phrases} isShrunk={isShrunk} index={0} content={""} name={"למילון הכנסת"}></AllPhrasesComp>
            {/* <PhraseComp isShrunk={isShrunk} index={1} content={phrases[1]?.explanation} name={phrases[1]?.term}></PhraseComp> */}
            <tr>
              <td className="info-table-horizontal-separator">
                <div className="daily-info-line"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
}
