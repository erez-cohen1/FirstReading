import { DOMParser } from "xmldom";

export async function getKnessetData() {
  // Make the HTTP GET request to the NASA API
  const response = await fetch(
    "http://knesset.gov.il/Odata/ParliamentInfo.svc/KNS_Committee()?$expand=KNS_CommitteeSessions&$filter=KnessetNum eq 25"
    // "http://knesset.gov.il/Odata/ParliamentInfo.svc/KNS_Committee(926)?$filter=KnessetNum eq 25&$expand=KNS_CommitteeSessions"
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
  const TypeDesc = xmlDoc.getElementsByTagName("d:TypeDesc");
  const startDate = xmlDoc.getElementsByTagName("d:StartDate");
  const finishDate = xmlDoc.getElementsByTagName("d:FinishDate");
  for (let i = 0; i < Names.length; i++) {
    console.log(
      Names[i].textContent.split("").reverse().join(""),
      ", ",
      TypeDesc[i].textContent.split("").reverse().join(""),
      ", ",
      startDate[i].textContent,
      ", ",
      finishDate[i].textContent
    );
  }
}
getKnessetData();
