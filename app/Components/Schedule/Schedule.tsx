"use client";

import { useEffect, useState } from "react";
import { fetchScheduleData } from "./getScheduleData";
import { ScheduleEventType, ScheduleData, CommitteeEvent, PlenumEvent, KnsEvent } from "./ScheduleDataTypes";
import CommitteeEventComp from "./CommitteeEvent";
import PlenumEventComp from "./PlenumEvent";
import KnsEventComp from "./KnsEvent";
import LoadingGif from "../../../basic_loading.gif";

export default function Schedule({ date, isShrunk, headerNum }: { date: Date; isShrunk: boolean; headerNum: number }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ScheduleData>({
    eventsNumber: 0,
    CurrentDateText: " ",
    CurrentPlenumEvents: [],
    CurrentCommitteeEvents: [],
    CurrentKnsEvents: [],
  });
  useEffect(() => {
    setLoading(true);
    const dateString = date.toISOString();
    fetchScheduleData(dateString, -1, ScheduleEventType.Plenum, setLoading, setEvents);
  }, [date]);

  const rows = (events.eventsNumber - 1) * 2 + 1;
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

  if (loading) {
    return (
      <>
        <header
          className={`Component-header ${isShrunk ? `header-2-small` : `header-2-big`} ${
            headerNum == 4 ? "bottom-1-small" : "bottom-2-small"
          }`}
          id="Schedule-header"
        >
          <a href="#Schedule-main">
            <h1>סדר יום</h1>
          </a>
        </header>
        <main className="Component-main" id="Schedule-main">
          <br />
          <br />
          <img src={"/LoadingFinal.gif"} alt="loading" className="loading-gif" />
          <br />
        </main>
      </>
    );
  }
  if (
    events.CurrentCommitteeEvents.length == 0 &&
    events.CurrentPlenumEvents.length == 0 &&
    events.CurrentKnsEvents.length == 0 &&
    !loading
  ) {
    return (
      <>
        <header
          className={`Component-header ${isShrunk ? `header-2-small` : `header-2-big`} ${
            headerNum == 4 ? "bottom-1-small" : "bottom-2-small"
          }`}
          id="Schedule-header"
        >
          <a href="#Schedule-main">
            <h1>סדר יום</h1>
          </a>
        </header>
        <main className="Component-main" id="Schedule-main">
          <br />
          <h3 style={{ textAlign: "center" }}>היום לא מתקיימים דיוני ועדות, ישיבת מליאה ואירועים מיוחדים בכנסת</h3>
          <br />
        </main>
      </>
    );
  }

  return (
    <>
      <header className={`Component-header ${isShrunk ? "header-2-small" : "header-2-big"}`} id="Schedule-header">
        <a href="#Schedule-main" className="header-link">
          <h1>סדר יום</h1>
        </a>
      </header>
      {loading ? (
        <main className="Component-main" id="Schedule-main">
          <br />
          <h3 style={{ textAlign: "center" }}>היום לא מתקיימים דיוני ועדות, ישיבת מליאה ואירועים מיוחדים בכנסת</h3>
          <br />
        </main>
      ) : (
        <main className="Component-main" id="Schedule-main">
          <table className="Schedule-table">
            <tbody className={`Schedule-table-body showAll}`}>
              {sortedEvents.map((event, index) => {
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
            </tbody>
          </table>
        </main>
      )}
    </>
  );
}
