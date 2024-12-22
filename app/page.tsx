import Schedule from "./Components/Schedule";
import VoteCount from "@/lib/components/votes";
import LawCount from "@/lib/components/laws";
import { TimelineItem, TimelineProps } from "./Components/TimeLine";
import Timeline from "./Components/TimeLine";
import Image from "next/image";
import { getKnessetData } from "./getKnessetDataCheck";

export default function Home() {
  return (
    <main>
      <h1> מה שקורה בכנסת.</h1>
      <Schedule></Schedule>
      {/* <Timeline items={data.items}></Timeline> */}
      {/* <LawCount></LawCount>
      <VoteCount></VoteCount> */}
      {/* add instance of each component here */}
    </main>
  );
}
