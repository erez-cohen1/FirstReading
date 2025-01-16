import { Dispatch, SetStateAction } from "react";
import { ScheduleData, ScheduleEventType, PlenumEvent, CommitteeEvent, KnsEvent } from "./Components/ScheduleDataTypes";

import axios from "axios";
import Papa from "papaparse";
import { head } from "axios";
/*
 * Fetch data from the Knesset API
 * @param url - the url to fetch data from
 * @param requestInit - the request options
 * @returns the fetched data
 */
export async function fetchData(url: string, requestInit?: RequestInit) {
  try {
    const response = await fetch(url, requestInit);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

/*
 * Fetch schedule data from the Knesset API
 * @param date - the date to fetch data for
 * @param setEvents - a function to set the fetched data
 * @param id - the id of the event to fetch, if -1 so fetch all events
 * @param type - the type of the event to fetch, relevant only if id is not -1m
 * @returns the fetched schedule data
 */
export async function fetchScheduleData(
  date: string,
  id: number,
  type: ScheduleEventType,
  setEvents?: Dispatch<SetStateAction<ScheduleData>>
): Promise<any> {
  try {
    const data = await fetchData("https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsAgendaToday", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ SelectedDate: date, SelectedMonth: null, SelectedYear: null }),
    });
    const scheduleData: ScheduleData = {
      CommiteesNumber: data.CommiteesNumber,
      CurrentDateText: data.CurrentDateText,
      CurrentPlenumEvents: data.CurrentPlenumEvents.length == 0 ? [] : processPlenumEvents(data),
      CurrentCommitteeEvents: data.CurrentCommitteeEvents.length == 0 ? [] : processCommitteeEvents(data),
      CurrentKnsEvents: data.CurrentKnsEvents.length == 0 ? [] : processKnsEvents(data),
    };
    if (setEvents) {
      setEvents(scheduleData);
    }
    if (id == -1) {
      return scheduleData;
    } else {
      if (type == ScheduleEventType.Committee) {
        return scheduleData.CurrentCommitteeEvents[id];
      } else if (type == ScheduleEventType.Plenum) {
        return scheduleData.CurrentPlenumEvents[id];
      } else {
        return scheduleData.CurrentKnsEvents[id];
      }
    }
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    if (id != -1) {
      return null;
    }
    return {
      CommiteesNumber: 0,
      CurrentDateText: "",
      CurrentPlenumEvents: [],
      CurrentCommitteeEvents: [],
      CurrentKnsEvents: [],
    };
  }
}

/*
 * Process the fetched data of special occasions
 * @param data - the fetched data
 * @returns the processed data
 */
function processKnsEvents(data: ScheduleData): KnsEvent[] {
  return data.CurrentKnsEvents?.map((event: any, index: number) => {
    const cleanName: string = event.EventName.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\d{2}:\d{2}/, "")
      .trim();
    const groups = event.groups
      .replace(/\s+/g, "")
      .split(",")
      .map((group: string) => parseInt(group));
    return {
      id: index,
      EventStart: new Date(event.EventStart),
      EventType: event.EventType,
      EventName: cleanName,
      rnkParent: event.rnkParent,
      groups: groups,
      rnkChilds: event.rnkChilds,
    };
  });
}
/*
 * Process the fetched data of committee events
 * @param data - the fetched data
 * @returns the processed data
 */
function processCommitteeEvents(data: ScheduleData): CommitteeEvent[] {
  return data.CurrentCommitteeEvents?.map((event: any, index: number) => {
    let names: string[] = ["", ""];
    if (event.EventName != null) {
      names = event.EventName?.split("</p>").map((name: string) =>
        name?.indexOf("(") == -1 ? name : name?.substring(0, name?.indexOf("("))
      );
    }
    const committeeName = names[0]?.replace(/<\/?[^>]+(>|$)/g, "").trim();
    const eventName = names[1]?.replace(/<\/?[^>]+(>|$)/g, "").trim();
    let groups: number[] = [];
    if (event.groups != null) {
      groups = event.groups
        .replace(/\s+/g, "")
        .split(",")
        .map((group: string) => parseInt(group));
    }
    return {
      id: index,
      EventStart: new Date(event.EventStart),
      IsCanceled: event.IsCanceled,
      EventName: eventName,
      CommitteeName: committeeName,
      rnkParent: event.rnkParent,
      groups: groups,
      rnkChilds: event.rnkChilds,
    };
  });
}
/*
 * Process the fetched data of plenum events
 * @param data - the fetched data
 * @returns the processed data
 */
function processPlenumEvents(data: ScheduleData): PlenumEvent[] {
  return data.CurrentPlenumEvents?.map((event: any, index: number) => {
    return {
      id: index,
      RowNum: isNaN(event.RowNum) ? 0 : event.RowNum,
      EventStart: new Date(event.startTime),
      SessionNumber: event.SessionNumber,
      SessionTitleStr: event.SessionTitleStr,
      FK_SessionID: event.FK_SessionID,
      Name: event.Name?.indexOf("(") == -1 ? event.Name : event.Name?.substring(0, event.Name?.indexOf("(")),
      FK_ItemID: event.FK_ItemID,
      IsBill: event.IsBill,
      IsAgendaSug: event.IsAgendaSug,
      FK_StatusID: event.FK_StatusID,
    };
  });
}

//create a function that fetches csv data from the url https://production.oknesset.org/pipelines/data/committees/kns_committeesession/kns_committeesession.csv
// in addition, the function will filter the rows according to one column and return the data

export async function fetchCommitteeData(committee: CommitteeEvent) {
  // const response = await fetch(
  //   "https://production.oknesset.org/pipelines/data/committees/kns_committeesession/kns_committeesession.csv",
  //   {
  //     headers: {
  //       "sec-fetch-mode": "no-cors",
  //       "access-control-allow-origin": "*",
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch data: ${response.statusText}`);
  // }
  // const responseText = await response.text();
  // const csv = Papa.parse(responseText, { header: true, skipEmptyLines: true });
  // console.log(csv.data);
  // const filteredData = csv.data.filter((row: any) => row.committee_name == committee.CommitteeName && row.StartDate);
  try {
    console.log("starting fetch CSV file");
    const response = await axios.get("/api-schedule");
    const responseData = response.data as {
      query_result: { data: { rows: any[] } };
    };
    // const parsedData = Papa.parse(csvText, {
    //   header: true,
    //   skipEmptyLines: true,
    // });
    console.log(responseData.query_result.data);
    // return parsedData.data.filter((row) => row[filterColumn] === filterValue);
  } catch (error) {
    console.error("Error fetching or parsing CSV data:", error);
    throw error;
  }
}
