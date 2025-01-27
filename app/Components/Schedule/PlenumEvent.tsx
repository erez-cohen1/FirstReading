"use client";

import { ScheduleEventType, ScheduleData, PlenumEvent, PlenumMainEvent } from "@/app/Components/Schedule/ScheduleDataTypes";
import { useEffect, useState } from "react";
import { fetchScheduleData } from "./getScheduleData";

export default function PlenumEventComp({ events, index, rows }: { events: PlenumEvent[]; index: number; rows: number }) {
  return (
    <>
      {index != 0 ? (
        <tr>
          <td></td>
          <td colSpan={2} className="Schedule-table-horizontal-separator">
            <div className="Schedule-horizontal-line"></div>
          </td>
        </tr>
      ) : null}
      <tr className="schedule-event-row">
        <td className="schedule-hour-cell">
          {events.length > 0 && (
            <h3>
              {events[0].EventStart.getHours()}:
              {events[0].EventStart.getMinutes() == 0
                ? events[0].EventStart.getMinutes() + "0"
                : events[0].EventStart.getMinutes()}
            </h3>
          )}
        </td>
        {index == 0 ? (
          <td rowSpan={rows} className="Schedule-table-separator">
            <div className="Schedule-vertical-line"></div>
          </td>
        ) : null}
        <td className="schedule-event-cell-opened">
          <details>
            <summary>
              <div className={`schedule-event-title`}>
                <h3>ישיבת מליאה</h3>
                <p>סדר יום המליאה:</p>
                <div>
                  <p key={index} className="schedule-event-description">
                    1. {events[0].Name}
                  </p>
                </div>
              </div>
              <i className="arrow down"></i>
            </summary>
            <div className="schedule-event-description">
              {events.map(
                (event, index) =>
                  index != 0 && (
                    <>
                      <p key={index}>
                        {index + 1}. {event.Name}
                      </p>
                      <br />
                    </>
                  )
              )}
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}
