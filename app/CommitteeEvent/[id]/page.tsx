"use client";

import { CommitteeEvent, ScheduleEventType } from "../../Components/Schedule";
import { useEffect, useState } from "react";
import { getEventById } from "../../getScheduleData";

export default function ScheduleEvent({ params }: { params: { id: number } }) {
  const [event, setEvent] = useState<CommitteeEvent | null>(null);
  useEffect(() => {
    getEventById(params.id.toString()).then((event) => {
      setEvent(event);
    });
  }, [params.id]);

  return (
    <div>
      <h2>{event?.CommitteeName}</h2>
      <p>{event?.EventDiscription}</p>
      <p>{event?.EventParticipants}</p>
      <a href={event?.EventLiveStream}>Live Stream</a>
      <p>
        <b>
          {event?.EventStart.getHours()}:
          {event?.EventStart.getMinutes() == 0
            ? event?.EventStart.getMinutes() + "0"
            : event?.EventStart.getMinutes()}
          {" " + event?.CommitteeName}
        </b>{" "}
        <br /> {event?.EventName}
      </p>
      <a href="/">
        <button>Back to Schedule</button>
      </a>
    </div>
  );
}
