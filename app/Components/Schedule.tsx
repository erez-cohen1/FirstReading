"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchEvent, fetchScheduleData } from "../getScheduleData";
import Link from "next/link";

export enum ScheduleEventType {
  Plenum = 1,
  Committee,
  SpecialOccasion,
}

export interface ScheduleData {
  CommiteesNumber?: number;
  CurrentDateText?: string;
  CurrentPlenumEvents: PlenumEvent[];
  CurrentCommitteeEvents: CommitteeEvent[];
  CurrentKnsEvents: KnsEvent[];
}

export interface ScheduleDataProps {
  SelectedDate: string;
  SelectedMonth: string | null;
  SelectedYear: string | null;
}

export interface CommitteeEvent {
  id: number;
  EventStart: Date; // "2025-01-07T10:30:00"
  // StartTime: Date; // "בשעה 10:30"
  // StartTimeClean: Date; // "10:30"
  IsCanceled: boolean;
  CommitteeName: string;
  EventName: string;
  rnkParent: number; // hour group rank
  groups: number[]; // list of all ranks of hour groups "22, 20, 18, 12, 7, 6, 4, 3, 1"
  rnkChilds: number; // id in the hour group
  EventDiscription?: string; // full discription of the event
  EventParticipants?: string[];
  EventLiveStream?: string; // url to live stream
}

export interface PlenumEvent {
  id: number;
  RowNum: number;
  // startTimeStr: Date;
  EventStart: Date;
  SessionNumber: number;
  SessionTitleStr: string; // title of the plenum session
  FK_SessionID: number;
  Name: string;
  FK_ItemID: number;
  IsBill: boolean;
  IsAgendaSug: boolean;
  FK_StatusID: number;
}

export interface KnsEvent {
  id: number;
  EventStart: Date; // "2025-01-07T12:00:00";
  // StartDate: Date; // "07/01/2025";
  // StartTime: Date; //"בשעה 12:00";
  // StartTimeClean: string; //"12:00";
  EventType: number; //3;
  EventName: string;
  rnkParent: number; // hour group rank
  groups: number[]; // list of all ranks of hour groups "22, 20, 18, 12, 7, 6, 4, 3, 1"
  rnkChilds: number; // id in the hour group
}

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleData>({
    CommiteesNumber: 0,
    CurrentDateText: " ",
    CurrentPlenumEvents: [],
    CurrentCommitteeEvents: [],
    CurrentKnsEvents: [],
  });

  useEffect(() => {
    const today = new Date(Date.now());
    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 2
    );
    const todayString = today.toISOString();
    const yesterdayString = yesterday.toISOString();
    const scheduleParams = {
      SelectedDate: todayString,
      SelectedMonth: null,
      SelectedYear: null,
    };
    fetchScheduleData(scheduleParams, setEvents);
  }, []);

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
                <Link href={`/CommitteeEvent/${event.id}`} key={event.id}>
                  <li key={event.id}>
                    <b>
                      {event.EventStart.getHours()}:
                      {event.EventStart.getMinutes() == 0
                        ? event.EventStart.getMinutes() + "0"
                        : event.EventStart.getMinutes()}
                      {" " + event.CommitteeName}
                    </b>{" "}
                    <br /> {event.EventName}
                  </li>
                </Link>
              ))}
              {events.CurrentPlenumEvents.map((event) => (
                <li key={event.FK_ItemID}>
                  <b>
                    {" "}
                    {event.EventStart.getHours()}:
                    {event.EventStart.getMinutes() == 0
                      ? event.EventStart.getMinutes() + "0"
                      : event.EventStart.getMinutes()}
                    {" ישיבת מליאה "}
                  </b>{" "}
                  <br /> {event.Name}
                </li>
              ))}
              {events.CurrentKnsEvents.map((event) => (
                <li key={event.id}>
                  <b>{event.EventStart.toISOString()}</b> <br />{" "}
                  {event.EventName}
                </li>
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
1. order in the code of events navigation
2. make page for plenum and kns events
3. add to the fetchEvent function the all the event's data
4. display only 5 events in the Schedule component
5. add a button that will display more events
6. add internal scroll in the event name

7. add state for main page of the date
8. search for more data about the events.
*/
