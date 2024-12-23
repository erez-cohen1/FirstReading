import { DOMParser } from "xmldom";

export async function getKnessetData() {
  // Make the HTTP GET request to the NASA API
  const response = await fetch(
    "http://knesset.gov.il/Odata/ParliamentInfo.svc/KNS_Committee()?$filter=KnessetNum eq 20"
  );
  // Check if the response is successful
  if (!response.ok) {
    console.log("Error fetching data:", response.status, response.statusText);
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const Names = xmlDoc.getElementsByTagName("d:Name");

  for (let i = 0; i < Names.length; i++) {
    console.log(Names[i].textContent.split("").reverse().join(""));
  }
}
