"use client";

import { useEffect, useState } from "react";
import { fetchScheduleData } from "./getScheduleData";
import Link from "next/link";
import { ScheduleEventType, ScheduleData, CommitteeEvent, PlenumEvent, KnsEvent } from "./ScheduleDataTypes";
import { all } from "axios";
import CommitteeEventComp from "./CommitteeEvent";
import PlenumEventComp from "./PlenumEvent";
import KnsEventComp from "./KnsEvent";

export default function Schedule({ date }: { date: Date }) {
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [events, setEvents] = useState<ScheduleData>({
    eventsNumber: 0,
    CurrentDateText: " ",
    CurrentPlenumEvents: [],
    CurrentCommitteeEvents: [],
    CurrentKnsEvents: [],
  });
  useEffect(() => {
    const dateString = date.toISOString();
    fetchScheduleData(dateString, -1, ScheduleEventType.Plenum, setLoading, setEvents);
  }, [date]);

  const rows = (events.eventsNumber - 1) * 2 + 1;
  let showedPlenum = 0;
  let sortedEvents: Array<CommitteeEvent | PlenumEvent | KnsEvent> = [];
  for (let i = 0; i < events.CurrentCommitteeEvents.length; i++) {
    sortedEvents.push(events.CurrentCommitteeEvents[i]);
  }
  if (events.CurrentPlenumEvents.length > 0) {
    sortedEvents.push(events.CurrentPlenumEvents[0]);
  }
  for (let i = 0; i < events.CurrentKnsEvents.length; i++) {
    sortedEvents.push(events.CurrentKnsEvents[i]);
  }
  sortedEvents.sort((a, b) => {
    return a.EventStart.getTime() - b.EventStart.getTime();
  });
  if (
    events.CurrentCommitteeEvents.length == 0 &&
    events.CurrentPlenumEvents.length == 0 &&
    events.CurrentKnsEvents.length == 0 &&
    !loading
  ) {
    return (
      // <div className="Component" id="Schedule">
      <>
        <header className="Component-header header-1" id="Schedule-header">
          <h1>סדר יום</h1>
          <h1></h1>
        </header>
        <main>
          <h2>היום לא מתקיימים דיוני ועדות, ישיבת מליאה ואירועים מיוחדים בכנסת</h2>
        </main>
      </>
      // </div>
    );
  }

  if (loading) {
    return (
      <>
        <header className="Component-header header-1" id="Schedule-header">
          <h1>סדר יום</h1>
          <h1></h1>
        </header>
        <main>
          <h2>טוען סדר יום...</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="Component-header header-1" id="Schedule-header">
        <h1>סדר יום</h1>
        <h1></h1>
      </header>
      <main className="Component-main">
        <table className="Schedule-table">
          <tbody className={`Schedule-table-body ${showAll ? "showAll" : ""}`}>
            {sortedEvents.map((event, index) => {
              const shouldShow = showAll || index < 5; // Show all rows if showAll is true, otherwise only the first 5
              if (!shouldShow) return null;

              if (event.EventType == ScheduleEventType.Committee) {
                return (
                  <CommitteeEventComp
                    event={event as CommitteeEvent}
                    index={index}
                    showTime={index == 0 || event.EventStart.toISOString() != sortedEvents[index - 1].EventStart.toISOString()}
                    rows={rows}
                    key={index}
                  ></CommitteeEventComp>
                );
              } else if (event.EventType == ScheduleEventType.Plenum) {
                return (
                  <PlenumEventComp events={events.CurrentPlenumEvents} rows={rows} index={index} key={index}></PlenumEventComp>
                );
              } else if (event.EventType == ScheduleEventType.SpecialOccasion) {
                return (
                  <KnsEventComp
                    event={event as KnsEvent}
                    index={index}
                    showTime={index == 0 || event.EventStart.toISOString() != sortedEvents[index - 1].EventStart.toISOString()}
                    key={index}
                  ></KnsEventComp>
                );
              }
            })}
            <tr>
              <td></td>
              <td colSpan={2} className="Schedule-table-horizontal-separator">
                <div className="Schedule-horizontal-line"></div>
              </td>
            </tr>
            <tr
              className="schedule-event-row" // Add custom styling
              onClick={() => setShowAll(!showAll)}
            >
              <td></td>
              <td className="schedule-event-cell-opened" colSpan={4}>
                <div className="schedule-expand-row">
                  <div className={`schedule-event-title`}>{!showAll ? <h3>לסדר היום המלא</h3> : <h3>הסתר</h3>}</div>
                  <i className={`arrow ${!showAll ? "down" : "up"}`}></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
}

/*
TODO:
8. find each committee discription
10. fix long committee names
12. add link from each event to the law/vote
14. fix lines not same opacity
*/
