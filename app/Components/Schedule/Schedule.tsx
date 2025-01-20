"use client";

import { useEffect, useState } from "react";
import { fetchScheduleData } from "./getScheduleData";
import Link from "next/link";
import { ScheduleEventType, ScheduleData } from "./ScheduleDataTypes";
import { all } from "axios";
import CommitteEvent from "./CommitteeEvent";

export default function Schedule({ date }: { date: Date }) {
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="Component" id="Schedule">
        <header className="Component-header" id="Schedule-header">
          <h1>סדר יום</h1>
          <h1></h1>
        </header>
        <main>
          <h2>טוען סדר יום...</h2>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="Component" id="Schedule">
        <header className="Component-header" id="Schedule-header">
          <h1>סדר יום</h1>
          <h1></h1>
        </header>
        <main className="Component-main">
          <table className="Schedule-table">
            <tbody>
              {events.CurrentCommitteeEvents.map((event) => (
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
                      <h3>
                        {event.EventStart.getHours()}:
                        {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
                      </h3>
                    </td>
                    {event.id == 0 ? (
                      <td rowSpan={rows} className="Schedule-table-separator">
                        <div className="Schedule-vertical-line"></div>
                      </td>
                    ) : null}
                    <CommitteEvent event={event}></CommitteEvent>
                  </tr>
                </>
              ))}
              {events.CurrentPlenumEvents.length > 0 && (
                <tr>
                  <td>
                    {events.CurrentPlenumEvents[0].EventStart.getHours()}:
                    {events.CurrentPlenumEvents[0].EventStart.getMinutes() == 0
                      ? events.CurrentPlenumEvents[0].EventStart.getMinutes() + "0"
                      : events.CurrentPlenumEvents[0].EventStart.getMinutes()}
                  </td>
                  <td>
                    <b>ישיבת מליאה:</b>
                    <br />
                    <ul>
                      {events.CurrentPlenumEvents.map((event) => (
                        <li key={event.FK_ItemID}>{event.Name}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              {events.CurrentKnsEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    {event.EventStart.getHours()}:
                    {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
                  </td>
                  <td>
                    <b>{event.EventStart.toISOString()}</b>
                    <br /> {event.EventName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {events.CurrentPlenumEvents.length > 0 && (
                <Link href={`/PlenumEvent/${events.CurrentPlenumEvents[0].EventStart.toISOString()}`} key="0">
                  <li>
                    <b>ישיבת מליאה:</b>
                    <ul>
                      {events.CurrentPlenumEvents.map((event) => (
                        <li key={event.FK_ItemID}>
                          {event.EventStart.getHours()}:
                          {event.EventStart.getMinutes() == 0
                            ? event.EventStart.getMinutes() + "0"
                            : event.EventStart.getMinutes()}
                          {" - " + event.Name}
                        </li>
                      ))}
                    </ul>
                  </li>
                </Link>
              )}
              {events.CurrentKnsEvents.map((event) => (
                <Link
                  href={{
                    pathname: `/KnsEvents/${event.id}`,
                    query: { dateString: event.EventStart.toISOString() },
                  }}
                  key="0"
                >
                  <li key={event.id}>
                    <b>{event.EventStart.toISOString()}</b> <br /> {event.EventName}
                  </li>
                </Link>
              ))}
              {events.CurrentCommitteeEvents.length == 0 &&
              events.CurrentPlenumEvents.length == 0 &&
              events.CurrentKnsEvents.length == 0 ? (
                <li>אין אירועים היום</li>
              ) : null}
            </ul>
          </section>
        </main>
        <footer className="Component-footer"></footer>
      </div>
    </>
  );
}

/*
TODO:
3. add to the fetchEvent function the all the event's data - url, participants, description, etc.
4. display only 5 events in the Schedule component
5. add a button that will display more events
6. add internal scroll in the event name
8. search for more data about the events.
*/
