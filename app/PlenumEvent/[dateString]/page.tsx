"use client";

import { ScheduleEventType, ScheduleData, PlenumEvent, PlenumMainEvent } from "@/app/Components/ScheduleDataTypes";
import { useEffect, useState } from "react";
import { fetchScheduleData } from "../../getScheduleData";

export default function PlenumEventComp({ params }: { params: { dateString: string } }) {
  const [mainEvent, setMainEvent] = useState<PlenumMainEvent>({
    EventStart: new Date(params.dateString),
    SessionNumber: 0, // plenum session number
    SessionTitleStr: "", // title of the plenum session
    FK_SessionID: 0, // plenum session id
    PlenumEvents: [],
  });
  useEffect(() => {
    fetchScheduleData(params.dateString, -1, ScheduleEventType.Plenum).then((event) => {
      const events = event.CurrentPlenumEvents;
      if (events != undefined) {
        setMainEvent({
          EventStart: events[0].EventStart,
          SessionNumber: events[0].SessionNumber,
          SessionTitleStr: events[0].SessionTitleStr,
          FK_SessionID: events[0].FK_SessionID,
          PlenumEvents: events,
        });
      }
    });
  }, [params.dateString]);

  return (
    <div>
      <h2>{mainEvent.SessionTitleStr}</h2>
      {mainEvent.PlenumEvents.map((event: PlenumEvent) => (
        <li key={event.FK_ItemID}>
          {event.EventStart.getHours()}:
          {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
          {" - " + event.Name}
        </li>
      ))}
      <a href="/">
        <button>Back to Schedule</button>
      </a>
    </div>
  );
}
