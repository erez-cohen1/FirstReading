import { Dispatch, SetStateAction } from "react";
import {
  ScheduleData,
  ScheduleDataProps,
  ScheduleEventType,
  ScheduleEvent,
} from "./Components/Schedule";

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

export const fetchScheduleData = async (
  scheduleParams: ScheduleDataProps,
  setEvents: Dispatch<SetStateAction<ScheduleData>>
) => {
  try {
    const data = await fetchData(
      "https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsToday",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleParams),
      }
    );
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch data: ${response.statusText}`);
    // }
    // const data = await response.json();

    // parse the events from the json data
    const events: ScheduleEvent[] = data.CurrentEvents.map((event: any) => {
      // remove html tags and time from the event name
      const cleanName: string = event.EventName.replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/\d{2}:\d{2}/, "")
        .trim();
      return {
        EventStart: event.EventStart,
        StartDate: event.StartDate,
        StartTime: event.StartTime,
        EventType: event.EventType,
        EventName: cleanName,
        committee_rank: event.committee_rank,
      };
    });
    //count the number of committees
    // const commiteesNumber = events.filter(
    //   (event) => event.EventType === ScheduleEventType.Committee
    // ).length;
    // const Comittees = events.filter(
    //   (event) => event.EventType === ScheduleEventType.Committee
    // );
    // const Plenum = events.filter(
    //   (event) => event.EventType === ScheduleEventType.Plenum
    // );
    // const SpecialOccasions = events.filter(
    //   (event) => event.EventType === ScheduleEventType.SpecialOccasion
    // );
    setEvents({ Events: events });
    // return {
    //   Events: [...Comittees, ...Plenum, ...SpecialOccasions],
    //   CommiteesNumber: commiteesNumber,
    // };
    // const events = { Events: data.CurrentEvents };

    // return events;
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return { Events: [] };
  }
};
