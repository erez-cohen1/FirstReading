"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchScheduleData } from "../getScheduleData";

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
  EventStart: Date; // "2025-01-07T10:30:00"
  // StartTime: Date; // "בשעה 10:30"
  // StartTimeClean: Date; // "10:30"
  IsCanceled: boolean;
  CommitteeName: string;
  EventName: string;
  rnkParent: number; // hour group rank
  groups: number[]; // list of all ranks of hour groups "22, 20, 18, 12, 7, 6, 4, 3, 1"
  rnkChilds: number; // id in the hour group
}

export interface PlenumEvent {
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
      today.getDate()
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
          {/* <a href="#">
            <img src="Share-icon.png" alt="Share icon" />
          </a> */}
        </header>
        <main className="Component-main">
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {events.CurrentCommitteeEvents.map((event) => (
                <li key={event.EventName}>
                  <b>
                    {event.EventStart.getHours()}:
                    {event.EventStart.getMinutes() == 0
                      ? event.EventStart.getMinutes() + "0"
                      : event.EventStart.getMinutes()}
                    {" " + event.CommitteeName}
                  </b>{" "}
                  <br /> {event.EventName}
                </li>
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
                <li key={event.EventName}>
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
1. add a button to each event that will navigate to the ScheduleEvent component
2. add a function that will fetch the event description and participants
3. add a function that will fetch the event live stream
4. display only 5 events in the Schedule component
5. add a button that will display more events
6. create component PlenumEvent that will display the plenum events
*/
