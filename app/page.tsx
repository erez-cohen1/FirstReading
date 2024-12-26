import Schedule from "./Components/Schedule";
import LawCount from "./Components/Laws";
import VoteCount from "./Components/Votes";
import Image from "next/image";
import Timeline from "./Components/TimeLine";
// import { getKnessetData } from "./getKnessetData";

export default function Home() {
  return (
    <main>
      <h1> מה שקורה בכנסת.</h1>
      <Schedule></Schedule>
      <LawCount></LawCount>
      <VoteCount></VoteCount>
      <Timeline></Timeline>
      {/* add instance of each component here */}
    </main>
  );
}
