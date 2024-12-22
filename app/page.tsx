import Schedule from "./Components/Schedule";
import Image from "next/image";
import { getKnessetData } from "./getKnessetDataCheck";

export default function Home() {
  return (
    <main>
      <h1> מה שקורה בכנסת.</h1>
      <Schedule></Schedule>
      {/* add instance of each component here */}
    </main>
  );
}
