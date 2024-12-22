import Schedule from "./Components/Schedule";
import LawCount from "./Components/Laws";
import VoteCount from "./Components/Votes";
import Image from "next/image";
import { getKnessetData } from "./getKnessetDataCheck";

export default function Home() {
  return (
    <main>
      <h1> מה שקורה בכנסת.</h1>
      <Schedule></Schedule>
      <LawCount></LawCount>
      <VoteCount></VoteCount>
      {/* add instance of each component here */}
    </main>
  );
}
