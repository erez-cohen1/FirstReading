"use client";

import { CommitteeEvent, ScheduleEventType } from "@/app/Components/ScheduleDataTypes";
import { useEffect, useState } from "react";
import { fetchCommitteeData, fetchScheduleData } from "../../getScheduleData";

export default function CommitteeEventComp({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { dateString: string };
}) {
  const [event, setEvent] = useState<CommitteeEvent>({
    id: 0,
    EventStart: new Date(searchParams.dateString),
    IsCanceled: false,
    CommitteeName: "",
    EventName: "",
    rnkParent: 0,
    groups: [],
    rnkChilds: 0,
  });

  useEffect(() => {
    fetchScheduleData(searchParams.dateString, params.id, ScheduleEventType.Committee).then((event) => {
      if (event != undefined) {
        setEvent(event);
      }
    });
    fetchCommitteeData(event);
  }, [params.id, searchParams?.dateString, event]);

  return (
    <div>
      <h2>{event.CommitteeName}</h2>
      <p>{event.EventDiscription}</p>
      <p>{event.EventParticipants}</p>
      <a href={event.EventLiveStream}>Live Stream</a>
      <p>
        <b>
          {event.EventStart.getHours()}:
          {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
          {" " + event.CommitteeName}
        </b>{" "}
        <br /> {event.EventName}
      </p>
      <a href="/">
        <button>Back to Schedule</button>
      </a>
    </div>
  );
}
