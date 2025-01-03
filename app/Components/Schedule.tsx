import { getScheduleData } from "../getKnessetData";

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
  EventStart: string;
  StartDate: string; //change to time format
  StartTime: string; // change to time format
  EventType: ScheduleEventType;
  EventName: string;
  committee_rank: number;
}

export default async function Schedule() {
  // get the date of today in the format of the API
  // const today = new Date(Date.now());
  // const todayString = today.toISOString();
  const scheduleParams = {
    SelectedDate: "2024-12-26T00:00:00.000Z",
    // SelectedDate: todayString,
    SelectedMonth: null,
    SelectedYear: null,
  };
  // get the schedule data
  const events: ScheduleData = await getScheduleData(scheduleParams);
  // split the events to commitees, plenum and special occasions
  const commitees = events.Events.filter(
    (event) => event.EventType === ScheduleEventType.Committee
  );
  const plenum = events.Events.filter(
    (event) => event.EventType === ScheduleEventType.Plenum
  );
  const specialOccasion = events.Events.filter(
    (event) => event.EventType === ScheduleEventType.SpecialOccasion
  );

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
              <h1 className="number-fig">{events.CommiteesNumber}</h1>
            </div>
            <h4>ועדות כונסו</h4>
          </section>
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              {commitees.map((event) => (
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
