import Schedule from "./Components/Schedule";
import LawCount from "./Components/Laws";
import VoteCount from "./Components/Votes";
import KnessetAttendance from "./Components/attendence";
import Image from "next/image";
import Timeline from "./Components/TimeLine";
import CurrentDate from "./Components/Date";
import LawSummary from "./Components/LawSummary";
// import { getKnessetData } from "./getKnessetData";

export default function Home() {
  return (
    <main className="main-page">
      <section className="main-header">
        <h1>
          קריאה <br />
          ראשונה
        </h1>
        <div className="date-selectors">
          <button className="date-selector-today">היום</button>
          <button className="date-selector-other">יום אחר</button>
        </div>
      </section>
      <section className="Date">
        <CurrentDate></CurrentDate>
      </section>
      <hr />
      <KnessetAttendance></KnessetAttendance>
      <Schedule></Schedule>
      <LawCount></LawCount>
      <VoteCount></VoteCount>
      <LawSummary queryId={1433} apiKey={process.env.REDASH_API_KEY as string}></LawSummary>
      {/* <Timeline></Timeline> */} 
    </main>
  );
}
