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
    // console.log(data);
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
  setEvents?: Dispatch<SetStateAction<ScheduleData>>,
  id?: number,
  type?: ScheduleEventType
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
      CurrentPlenumEvents:
        data.CurrentPlenumEvents.length == 0
          ? []
          : data.CurrentPlenumEvents?.map((event: any, index: number) => {
              return {
                id: index,
                RowNum: isNaN(event.RowNum) ? 0 : event.RowNum,
                EventStart: new Date(event.startTime),
                SessionNumber: event.SessionNumber,
                SessionTitleStr: event.SessionTitleStr,
                FK_SessionID: event.FK_SessionID,
                Name:
                  event.Name?.indexOf("(") == -1
                    ? event.Name
                    : event.Name?.substring(0, event.Name?.indexOf("(")),
                FK_ItemID: event.FK_ItemID,
                IsBill: event.IsBill,
                IsAgendaSug: event.IsAgendaSug,
                FK_StatusID: event.FK_StatusID,
              };
            }),
      CurrentCommitteeEvents:
        data.CurrentCommitteeEvents.length == 0
          ? []
          : data.CurrentCommitteeEvents?.map((event: any, index: number) => {
              let names: string[] = ["", ""];
              if (event.EventName != null) {
                names = event.EventName?.split("</p>").map((name: string) =>
                  name?.indexOf("(") == -1
                    ? name
                    : name?.substring(0, name?.indexOf("("))
                );
              }
              const committeeName = names[0]
                ?.replace(/<\/?[^>]+(>|$)/g, "")
                .trim();
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
            }),
      CurrentKnsEvents:
        data.CurrentKnsEvents.length == 0
          ? []
          : data.CurrentKnsEvents?.map((event: any, index: number) => {
              const cleanName: string = event.EventName.replace(
                /<\/?[^>]+(>|$)/g,
                ""
              )
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
            }),
    };
    if (setEvents) {
      setEvents(scheduleData);
    }
    // setEvents(scheduleData);
    // if (id && type) {
    //   if (type === ScheduleEventType.Committee) {
    //     return scheduleData.CurrentCommitteeEvents.find(
    //       (event) => event.id === id
    //     );
    //   }
    //   if (type === ScheduleEventType.Plenum) {
    //     return scheduleData.CurrentPlenumEvents.find(
    //       (event) => event.id === id
    //     );
    //   }
    //   if (type === ScheduleEventType.SpecialOccasion) {
    //     return scheduleData.CurrentKnsEvents.find((event) => event.id === id);
    //   }
    // }
    return scheduleData;
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return {
      CommiteesNumber: 0,
      CurrentDateText: "",
      CurrentPlenumEvents: [],
      CurrentCommitteeEvents: [],
      CurrentKnsEvents: [],
    };
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

//a function that fetches a specific event from the Knesset API
export const fetchEvent = async (
  scheduleParams: ScheduleDataProps,
  id: number,
  type: ScheduleEventType
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
    if (type == ScheduleEventType.Committee) {
      return data.CurrentCommitteeEvents.find((event: any, index: number) => {
        return index === id;
      });
    } else if (type == ScheduleEventType.Plenum) {
      return data.CurrentPlenumEvents.find((event: PlenumEvent) => {
        return event.id === id;
      });
    } else if (type == ScheduleEventType.SpecialOccasion) {
      return data.CurrentKnsEvents.find((event: KnsEvent) => {
        return event.id === id;
      });
    }
  } catch (error) {
    console.error("Error fetching event:", error);
  }
};

export async function getAllEventIds() {
  const today = new Date(Date.now());
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const todayString = today.toISOString();
  const yesterdayString = yesterday.toISOString();
  const scheduleParams = {
    SelectedDate: todayString,
    SelectedMonth: null,
    SelectedYear: null,
  };
  const events = await fetchScheduleData(scheduleParams);
  return events.CurrentCommitteeEvents.map((event) => {
    return {
      params: {
        id: event.id.toString(),
      },
    };
  });
}

export async function getEventById(id: string): Promise<CommitteeEvent> {
  const today = new Date(Date.now());
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const todayString = today.toISOString();
  const yesterdayString = yesterday.toISOString();
  const scheduleParams = {
    SelectedDate: todayString,
    SelectedMonth: null,
    SelectedYear: null,
  };
  const event = await fetchEvent(
    scheduleParams,
    Number.parseInt(id),
    ScheduleEventType.Committee
  );
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
    id: Number.parseInt(id),
    EventStart: new Date(event.EventStart),
    IsCanceled: event.IsCanceled,
    EventName: eventName,
    CommitteeName: committeeName,
    rnkParent: event.rnkParent,
    groups: groups,
    rnkChilds: event.rnkChilds,
  };
  // console.log(event?.id);
  // return event;
}
