"use client";

import { CommitteeEvent, CommitteeParticipant, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { use, useEffect, useState } from "react";
import { fetchCommitteeData, fetchScheduleData } from "./getScheduleData";

export default function CommitteeEventComp({
  event,
  index,
  showTime,
  rows,
}: {
  event: CommitteeEvent;
  index: number;
  showTime: boolean;
  rows: number;
}) {
  const chairMan: CommitteeParticipant | undefined = event.EventParticipants.find((mk) => mk.ParticipantRole === "יושב-ראש");
  return (
    <>
      {event.id != 0 ? (
        <tr>
          <td></td>
          <td colSpan={2} className="Schedule-table-horizontal-separator">
            <div className="Schedule-horizontal-line"></div>
          </td>
        </tr>
      ) : null}
      <tr key={event.id} className="schedule-event-row">
        <td className="schedule-hour-cell">
          {showTime && (
            <h3>
              {event.EventStart.getHours()}:
              {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
            </h3>
          )}
        </td>
        {event.id == 0 ? (
          <td rowSpan={rows} className="Schedule-table-separator">
            <div className="Schedule-vertical-line"></div>
          </td>
        ) : null}
        <td className="schedule-event-cell-opened">
          <details>
            <summary>
              <div className={`schedule-event-title`}>
                <h3>{event.CommitteeName}</h3>
                <p className={`schedule-event-description${event.IsCanceled ? " canceled" : ""}`}>{event.EventName}</p>
              </div>
              <i className="arrow down"></i>
            </summary>
            <h5>תחומי עיסוקה של הועדה</h5>
            <p>תקציב המדינה; מסים לכל סוגיהם; מכס ובלו; מלוות; ענייני מטבע חוץ; בנקאות ושטרי כסף; הכנסות והוצאות המדינה.</p>

            {event.EventParticipants.length > 0 && (
              <>
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
              </>
            )}
          </details>
        </td>
      </tr>
    </>
  );
}
