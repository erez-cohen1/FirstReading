"use client";

import { KnsEvent, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { useEffect, useState } from "react";
import { fetchScheduleData } from "./getScheduleData";

export default function KnsEventComp({ params, searchParams }: { params: { id: number }; searchParams: { dateString: string } }) {
  const [event, setEvent] = useState<KnsEvent>({
    id: 0,
    EventStart: new Date(searchParams.dateString),
    EventType: 0,
    EventName: "",
    rnkParent: 0,
    groups: [],
    rnkChilds: 0,
  });
  useEffect(() => {
    fetchScheduleData(searchParams.dateString, -1, ScheduleEventType.SpecialOccasion).then((event) => {
      if (event != undefined) {
        setEvent(event);
      }
    });
  }, [params.id, searchParams?.dateString]);

  return (
    <div>
      <h2>{event.EventName}</h2>
      <p>{event.EventType}</p>
      <p>
        <b>
          {event.EventStart.getHours()}:
          {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
        </b>{" "}
        <br /> {event.EventName}
      </p>
      <a href="/">
        <button>Back to Schedule</button>
      </a>
    </div>
  );
}
