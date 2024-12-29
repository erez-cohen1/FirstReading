import Schedule from "./Components/Schedule";
import LawCount from "./Components/Laws";
import VoteCount from "./Components/Votes";
import Image from "next/image";
import Timeline from "./Components/TimeLine";
import CurrentDate from "./Components/Date";
// import { getKnessetData } from "./getKnessetData";

export default function Home() {
  return (
    <main>
      <h1> מה שקורה בכנסת.</h1>
      <CurrentDate></CurrentDate>
      <Schedule></Schedule>
      <div className="row-display">
      <LawCount></LawCount>
      <VoteCount></VoteCount>
      </div>
      <Timeline></Timeline>
      {/* add instance of each component here */}
    </main>
  );
}
