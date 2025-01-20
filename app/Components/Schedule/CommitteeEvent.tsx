"use client";

import { CommitteeEvent, CommitteeParticipant, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { use, useEffect, useState } from "react";
import { fetchCommitteeData, fetchScheduleData } from "./getScheduleData";

export default function CommitteeEventComp({ event }: { event: CommitteeEvent }) {
  useEffect(() => {
    // fetchD
  });
  const chairMan: CommitteeParticipant | undefined = event.EventParticipants.find((mk) => mk.ParticipantRole === "יושב-ראש");
  return (
    <td className="schedule-event-cell-opened">
      <details>
        <summary>
          <div className={`schedule-event-title${event.IsCanceled ? " canceled" : ""}`}>
            <h3>{event.CommitteeName}</h3>
            <p className="schdule-event-description">{event.EventName}</p>
          </div>
          <i className="arrow down"></i>
        </summary>
        <h5>תחומי עיסוקה של הועדה</h5>
        <p>תקציב המדינה; מסים לכל סוגיהם; מכס ובלו; מלוות; ענייני מטבע חוץ; בנקאות ושטרי כסף; הכנסות והוצאות המדינה.</p>
        <h5>חברי הכנסת החברים בוועדה</h5>
        <div>
          <div className="schedule-event-participants-div">
            {chairMan && (
              <div className={`schedule-event-participant-cell`} key={chairMan?.ParticipantId}>
                <img src={chairMan?.ParticipantImage} alt={chairMan?.ParticipantName} />
                <p>
                  {chairMan?.ParticipantName}
                  <br />
                  <b>יושב ראש</b>
                </p>
              </div>
            )}

            {event.EventParticipants.filter((mk) => {
              return mk.ParticipantRole != "יושב-ראש";
            }).map((mk) => (
              <div className={`schedule-event-participant-cell`} key={mk.ParticipantId}>
                <img src={mk.ParticipantImage} alt={mk.ParticipantName} />
                <p>{mk.ParticipantName}</p>
              </div>
            ))}
          </div>
        </div>
      </details>
    </td>
  );
}
