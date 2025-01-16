"use client";

import { useEffect, useState } from "react";
import { fetchScheduleData } from "../getScheduleData";
import Link from "next/link";
import axios from "axios";
import { KnsEvent, PlenumEvent, ScheduleEventType, ScheduleData } from "./ScheduleDataTypes";

export default function Schedule({ date }: { date: Date }) {
  const [events, setEvents] = useState<ScheduleData>({
    CommiteesNumber: 0,
    CurrentDateText: " ",
    CurrentPlenumEvents: [],
    CurrentCommitteeEvents: [],
    CurrentKnsEvents: [],
  });

  // const [date, setDate] = useState<Date>(dateProp);

  useEffect(() => {
    // const today = new Date(Date.now());
    // const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);
    // const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const checkString = "2025-01-07T16:00:00";
    const dateString = date.toISOString();
    // const todayString = today.toISOString();
    // const yesterdayString = yesterday.toISOString();
    fetchScheduleData(dateString, -1, ScheduleEventType.Plenum, setEvents);
    const fetchRedashData = async () => {
      try {
        const response = await axios.get("/api-schedule");
        const responseData = response.data as {
          query_result: { data: { rows: any[] } };
        };
        console.log(responseData.query_result.data.rows);
      } catch (err) {
        console.error("Error redash data:", err);
      }
    };

    //

    // fetchRedashData();
    // fetchScheduleData(date.toISOString(), -1, ScheduleEventType.Plenum, setEvents);
  }, [date]);

  return (
    <>
      <div className="Component" id="Schedule">
        <header className="Component-header" id="Schedule-header">
          <h1>סדר יום</h1>
          <h1></h1>
          {/* <a href="#">
            <img src="Share-icon.png" alt="Share icon" />
          </a> */}
        </header>
        <main className="Component-main">
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {events.CurrentCommitteeEvents.map((event) => (
                //pass the event id and another argument to the link
                <Link
                  href={{
                    pathname: `/CommitteeEvent/${event.id}`,
                    query: { dateString: event.EventStart.toISOString() },
                  }}
                  key={event.id}
                >
                  <li key={event.id}>
                    <b>
                      {event.EventStart.getHours()}:
                      {event.EventStart.getMinutes() == 0 ? event.EventStart.getMinutes() + "0" : event.EventStart.getMinutes()}
                      {" " + event.CommitteeName}
                    </b>{" "}
                    <br /> {event.EventName}
                  </li>
                </Link>
              ))}
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
            </ul>
          </section>
        </main>
        <footer className="Component-footer">
          <div>
            <a href="#" className="expand-component">
              <p>לרשימה המלאה</p>
              {/* <img src="Schedule-arrow.png" alt="arrow" /> */}
            </a>
          </div>
        </footer>
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
