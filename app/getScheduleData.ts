import { Dispatch, SetStateAction } from "react";
import {
  ScheduleData,
  ScheduleDataProps,
  ScheduleEventType,
  PlenumEvent,
  CommitteeEvent,
  KnsEvent,
} from "./Components/Schedule";

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
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

/*
 * Fetch schedule data from the Knesset API
 * @param scheduleParams - the schedule parameters
 * @param setEvents - the state setter for the events
 */
export const fetchScheduleData = async (
  scheduleParams: ScheduleDataProps,
  setEvents: Dispatch<SetStateAction<ScheduleData>>
) => {
  try {
    const data = await fetchData(
      "https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsAgendaToday",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleParams),
      }
    );
    const scheduleData: ScheduleData = {
      CommiteesNumber: data.CommiteesNumber,
      CurrentDateText: data.CurrentDateText,
      CurrentPlenumEvents: data.CurrentPlenumEvents.map((event: any) => {
        return {
          RowNum: isNaN(event.RowNum) ? 0 : event.RowNum,
          EventStart: new Date(event.startTime),
          SessionNumber: event.SessionNumber,
          SessionTitleStr: event.SessionTitleStr,
          FK_SessionID: event.FK_SessionID,
          Name:
            event.Name.indexOf("(") == -1
              ? event.Name
              : event.Name.substring(0, event.Name.indexOf("(")),
          FK_ItemID: event.FK_ItemID,
          IsBill: event.IsBill,
          IsAgendaSug: event.IsAgendaSug,
          FK_StatusID: event.FK_StatusID,
        };
      }),
      CurrentCommitteeEvents: data.CurrentCommitteeEvents.map((event: any) => {
        const names: Array<string> = event.EventName.split("</p>").map(
          (name: string) =>
            name.indexOf("(") == -1
              ? name
              : name.substring(0, name.indexOf("("))
        );
        const committeeName = names[0].replace(/<\/?[^>]+(>|$)/g, "").trim();
        const eventName = names[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
        const groups = event.groups
          .replace(/\s+/g, "")
          .split(",")
          .map((group: string) => parseInt(group));
        return {
          EventStart: new Date(event.EventStart),
          IsCanceled: event.IsCanceled,
          EventName: eventName,
          CommitteeName: committeeName,
          rnkParent: event.rnkParent,
          groups: groups,
          rnkChilds: event.rnkChilds,
        };
      }),
      CurrentKnsEvents: data.CurrentKnsEvents.map((event: any) => {
        const cleanName: string = event.EventName.replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/\d{2}:\d{2}/, "")
          .trim();
        const groups = event.groups
          .replace(/\s+/g, "")
          .split(",")
          .map((group: string) => parseInt(group));
        return {
          EventStart: new Date(event.EventStart),
          EventType: event.EventType,
          EventName: cleanName,
          rnkParent: event.rnkParent,
          groups: groups,
          rnkChilds: event.rnkChilds,
        };
      }),
    };

    setEvents(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return { Events: [] };
  }
};

/*
 * Fetch event description from the Knesset API
 * @param id - the event id
 * @param setEventDescription - the state setter for the event description
 */
export const fetchEventDescription = async (
  id: string,
  setEventDescription: Dispatch<SetStateAction<string>> // setEventDescription is a function that takes a string and returns void
) => {
  try {
    const data = await fetchData(
      `https://knesset.gov.il/WebSiteApi/knessetapi/Committee/GetCommitteeEventDescription?eventID=${id}`
    );
    setEventDescription(data.Description);
  } catch (error) {
    console.error("Error fetching event description:", error);
  }
};

/*
 * Fetch event participants from the Knesset API
 * @param id - the event id
 * @param setEventParticipants - the state setter for the event participants
 */
export const fetchEventParticipants = async (
  id: string,
  setEventParticipants: Dispatch<SetStateAction<string>>
) => {
  try {
    const data = await fetchData(
      `https://knesset.gov.il/WebSiteApi/knessetapi/Committee/GetCommitteeEventParticipants?eventID=${id}`
    );
    setEventParticipants(data.Participants);
  } catch (error) {
    console.error("Error fetching event participants:", error);
  }
};
