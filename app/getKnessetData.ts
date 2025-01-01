interface ScheduleDataProps {
  SelectedDate: string;
  SelectedMonth: string | null;
  SelectedYear: string | null;
}

interface ScheduleEvent {
  EventStart: string;
  StartDate: string; //change to time format
  StartTime: string; // change to time format
  EventType: ScheduleEventType;
  EventName: string;
  committee_rank: number;
}

export enum ScheduleEventType {
  Plenum = 1,
  Committee,
  SpecialOccasion,
}

export interface ScheduleData {
  CommiteesNumber?: number;
  Events: ScheduleEvent[];
}

export async function getScheduleData(
  props: ScheduleDataProps
): Promise<ScheduleData> {
  // Make the HTTP POST request to the API

  // const responseJson: any = await fetchData(
  //   "https://knesset.gov.il/WebSiteApi/knessetapi/KnessetMainEvents/GetEventsToday",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(props),
  //   }
  // );
  const responseJson: any = {
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
        EventName: "<p>08:15</p><p> ישיבת הוועדה לביטחון לאומי</p>",
        committee_rank: 62,
      },
    ],
  };
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
  // const contentType = response.headers.get("Content-Type");

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  // if (contentType && contentType.includes("application/json")) {
  //   const data = await response.json();
  // } else {
  //   // Handle non-JSON responses appropriately
  //   console.error("Expected JSON, but received:", contentType);
  //   throw new Error("Failed to fetch data: Invalid response type");
  // }
  return await response.json();
}
