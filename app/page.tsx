import Schedule from "./Components/Schedule";
import LawCount from "./Components/Laws";
import VoteCount from "./Components/Votes";
import KnessetAttendance from "./Components/attendence";
import Image from "next/image";
import Timeline from "./Components/TimeLine";
// import { getKnessetData } from "./getKnessetData";

export default function Home() {
  return (
    <main>
      <h1> מה שקורה בכנסת.</h1>
      <KnessetAttendance></KnessetAttendance>
      <Schedule></Schedule>
      <LawCount></LawCount>
      <VoteCount></VoteCount>
      <Timeline></Timeline>
      {/* add instance of each component here */}
    </main>
  );
}
