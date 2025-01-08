"use server";
import {
  ScheduleData,
  ScheduleDataProps,
  ScheduleEventType,
  ScheduleEvent,
} from "./Components/Schedule";
export async function getScheduleData(
  props: ScheduleDataProps
): Promise<ScheduleData> {
  // Make the HTTP POST request to the API

  const responseJson: any = await fetchData(
    "https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsToday",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SelectedDate: "2024-12-26T00:00:00.000Z",
        // SelectedDate: todayString,
        SelectedMonth: null,
        SelectedYear: null,
      }),
    }
  );
  // parse the events from the json data
  const events: ScheduleEvent[] = responseJson.CurrentEvents.map(
    (event: any) => {
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
    }
  );
  //count the number of committees
  const commiteesNumber = events.filter(
    (event) => event.EventType === ScheduleEventType.Committee
  ).length;
  const Comittees = events.filter(
    (event) => event.EventType === ScheduleEventType.Committee
  );
  const Plenum = events.filter(
    (event) => event.EventType === ScheduleEventType.Plenum
  );
  const SpecialOccasions = events.filter(
    (event) => event.EventType === ScheduleEventType.SpecialOccasion
  );
  return {
    Events: [...Comittees, ...Plenum, ...SpecialOccasions],
    CommiteesNumber: commiteesNumber,
  };
}

/*
global fetching function for all fetch requests
*/
export async function fetchData(
  url: string,
  requestInit: RequestInit
): Promise<any> {
  const response = await fetch(url, requestInit);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const default_response = {
    CurrentDateText: [
      {
        SelectedDate: '23 בדצמבר 2024, כ"ב בכסלו תשפ"ה',
      },
    ],
    CurrentEvents: [
      {
        EventStart: "2024-12-23T08:15:00",
        StartDate: "23/12/2024",
        StartTime: "08:15",
        EventType: 2,
        EventName: `<p>08:15</p><p> </p>`,
        committee_rank: 62,
      },
    ],
  };

  // if the rsponse is json return response.json() else if the response is html
  return response.headers.get("Content-Type")?.includes("application/json")
    ? response.json()
    : default_response;
  // return await ;
}
