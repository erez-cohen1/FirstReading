"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchScheduleData } from "../getKnessetData";
import { get } from "axios";

export enum ScheduleEventType {
  Plenum = 1,
  Committee,
  SpecialOccasion,
}

export interface ScheduleData {
  CommiteesNumber?: number;
  Events: ScheduleEvent[];
}
export interface ScheduleDataProps {
  SelectedDate: string;
  SelectedMonth: string | null;
  SelectedYear: string | null;
}

export interface ScheduleEvent {
  EventName: string;
  EventStart: string;
  StartDate: string; //change to time format
  StartTime: string; // change to time format
  EventType: ScheduleEventType;
  committee_rank: number;
}

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleData>({ Events: [] });

  useEffect(() => {
    const today = new Date(Date.now());
    const todayString = today.toISOString();
    const scheduleParams = {
      SelectedDate: todayString,
      SelectedMonth: null,
      SelectedYear: null,
    };
    fetchScheduleData(scheduleParams, setEvents);
  }, []);

  // split the events to commitees, plenum and special occasions
  const committees =
    events.Events.filter(
      (event) => event.EventType === ScheduleEventType.Committee
    ) || [];
  const plenum =
    events?.Events?.filter(
      (event) => event.EventType === ScheduleEventType.Plenum
    ) || [];
  const specialOccasion =
    events?.Events?.filter(
      (event) => event.EventType === ScheduleEventType.SpecialOccasion
    ) || [];

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
          <section className="Schedule-section" id="Comeeties">
            <div>
              <h1 className="number-fig">{events?.CommiteesNumber}</h1>
            </div>
            <h4>ועדות כונסו</h4>
          </section>
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {committees.map((event) => (
                <li key={event.EventName}>
                  <b>{event.StartTime}</b> <br /> {event.EventName}
                </li>
              ))}
              {plenum.map((event) => (
                <li key={event.EventName}>
                  <b>{event.StartTime}</b> <br /> {event.EventName}
                </li>
              ))}
            </ul>
          </section>
          <section className="Schedule-section" id="Events">
            <ul>
              {specialOccasion.map((event) => (
                <li key={event.EventName}>
                  <b>{event.StartTime}</b> <br /> {event.EventName}
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
