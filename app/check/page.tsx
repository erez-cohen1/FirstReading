import { getKnessetData } from "../getKnessetDataCheck";

export default async function Knesset() {
  const dataCheck = await getKnessetData();
  console.log("hello");
  return (
    <main>
      <h1>Knesset Data</h1>
      {/* <div><p>{dataCheck}</p></div> */}
    </main>
  );
}
