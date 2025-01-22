"use client";

import { KnsEvent, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { useEffect, useState } from "react";
import { fetchScheduleData } from "./getScheduleData";

export default function KnsEventComp({ event, index, showTime }: { event: KnsEvent; index: number; showTime: boolean }) {
  return (
    <>
      <tr>
        <td></td>
        <td colSpan={2} className="Schedule-table-horizontal-separator">
          <div className="Schedule-horizontal-line"></div>
        </td>
      </tr>
      <tr key={event.id} className="schedule-event-row">
        <td className="schedule-hour-cell">
          {showTime && (
            <h3>
              {event.EventStart.getHours()}:
              {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
            </h3>
          )}
        </td>
        <td className="schedule-event-cell-opened">
          <details>
            <summary>
              <div className={`special-event-title`}>
                <h3>אירוע מיוחד</h3>
                <p className="schedule-event-description">{event.EventName}</p>
              </div>
              <i className="arrow down"></i>
            </summary>
          </details>
        </td>
      </tr>
    </>
  );
}
