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
                <div id="plenum-subject">
                  <div
                    key={index}
                    style={{
                      width: "0.7rem",
                      height: "0.7rem",
                      backgroundColor: "#FF6700",
                      border: "none",
                    }}
                  />
                  <p key={index + 1} className="schedule-event-description">
                    {events[0].Name}
                  </p>
                </div>
              </div>
              <i className="arrow down"></i>
            </summary>
            <div className="schedule-event-description">
              {events.map(
                (event, index) =>
                  index != 0 && (
                    <div key={index} id="plenum-subject">
                      <div
                        key={-index}
                        style={{
                          width: "0.7rem",
                          height: "0.7rem",
                          backgroundColor: "#FF6700",
                          border: "none",
                        }}
                      />
                      <p key={index}>{` ${event.Name}`}</p>
                      <br />
                    </div>
                  )
              )}
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}
