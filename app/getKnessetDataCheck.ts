// import { DOMParser } from "xmldom";

export async function getKnessetData() {
  console.log("Fetching data...");
  // Make the HTTP GET request to the NASA API
  // const response = await fetch(
  //   "http://knesset.gov.il/Odata/ParliamentInfo.svc/KNS_Committee()?$filter=KnessetNum eq 20"
  // );
  // // Check if the response is successful
  // if (!response.ok) {
  //   console.log("Error fetching data:", response.status, response.statusText);
  //   throw new Error(`Failed to fetch data: ${response.statusText}`);
  // }
  // const xmlText = await response.text();
  // // const parser = new DOMParser();
  // // const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  // // const commiittees = xmlDoc.getElementsByTagName("entry");

  // // const data = Array.from(commiittees).map((committee) => {
  // //   const name = committee.getElementsByTagName("d:Name");
  // //   const committeeTypeDesc = committee.getElementsByTagName(
  // //     "d:CommitteeTypeDesc"
  // //   );
  // //   console.log("Name:", name);
  // //   return { name, committeeTypeDesc };
  // // });
  // console.log("Data:", xmlText);
}
