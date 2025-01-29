"use client";

import { CommitteeEvent, CommitteeParticipant, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { RefObject, use, useEffect, useMemo, useRef, useState } from "react";
import { fetchCommitteeData, fetchScheduleData } from "./getScheduleData";
import useIsVisible from "./useIsVisible";

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
  const summaryRef = useRef<HTMLTableCellElement | null>(null);
  const isVisible = useIsVisible(summaryRef);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.currentTarget as HTMLDetailsElement;
    //closing the element
    // console.log(isVisible);
    if (!target.open) {
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (target.open) {
      // opening the element
      const detailsList: NodeListOf<HTMLDetailsElement> = document.querySelectorAll("details");
      // Close all other details elements.
      detailsList.forEach((details) => {
        if (details.textContent != target.textContent && details.id == target.id) {
          details.open = false;
        }
      });
    }
  };
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
            <h3 className="schedule-event-time">
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
        <td className="schedule-event-cell-opened" id={`committee-event-summary`} ref={summaryRef}>
          <details onToggle={handleToggle} id="schedule-committee">
            <summary>
              <div>
                <h3>{event.CommitteeName}</h3>
                <p className={`schedule-event-description${event.IsCanceled ? " canceled" : ""}`}>{event.EventName[0]}</p>
              </div>
              <i className="arrow down"></i>
            </summary>
            {event.EventName.length > 1 &&
              event.EventName.map(
                (subject, index) =>
                  index > 0 && (
                    <>
                      <p key={index} className={`schedule-event-description${event.IsCanceled ? " canceled" : ""}`}>
                        {subject}
                      </p>
                      <br />
                    </>
                  )
              )}
            <h5>תחומי עיסוקה של הועדה</h5>
            <p>{event.CommitteeDiscription}</p>
            {/* <p>תקציב המדינה; מסים לכל סוגיהם; מכס ובלו; מלוות; ענייני מטבע חוץ; בנקאות ושטרי כסף; הכנסות והוצאות המדינה.</p> */}

            {event.EventParticipants.length > 0 && (
              <>
                <br />
                <h5>חברי הכנסת החברים בוועדה</h5>
                <div>
                  <div className="schedule-event-participants-div">
                    {chairMan && (
                      <div className="grid-item" key={chairMan.ParticipantId}>
                        <img src={chairMan.ParticipantImage} alt={chairMan.ParticipantName} className={`mk-image`} />
                        <div className="mk-name">{chairMan.ParticipantName}</div>
                      </div>
                    )}

                    {event.EventParticipants.filter((mk) => {
                      return mk.ParticipantRole != "יושב-ראש";
                    }).map((mk) => (
                      <div className="grid-item" key={mk.ParticipantId}>
                        <img src={mk.ParticipantImage} alt={mk.ParticipantName} className={`mk-image`} />
                        <div className="mk-name">{mk.ParticipantName}</div>
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
