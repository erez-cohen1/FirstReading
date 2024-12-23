interface Event {
  EventStart: string;
  StartDate: string; //change to time format
  StartTime: string; // change to time format
  EventType: EventType;
  EventName: string;
  committee_rank: number;
}

enum EventType {
  Plenum = 1,
  Committee,
  SpecialOccasion,
}

interface ScheduleData {
  Events: Event[];
}

export default function Schedule() {
  return (
    <>
      <div className="Component" id="Schedule">
        <header className="Component-header">
          <h1>סדר יום</h1>
          <a href="#">
            <img src="Share-icon.png" alt="Share icon" />
          </a>
        </header>
        <main className="Component-main">
          <section className="Schedule-section" id="Comeeties">
            <div>
              <h1 className="number-fig">8</h1>
            </div>
            <h4>ועדות כונסו</h4>
          </section>
          <section className="Schedule-section" id="General-Assembly">
            <ul>
              <li>
                <b>11:00</b> <br /> ועדת הכספים
              </li>
              <li>
                <b>12:00</b> <br /> ועדת בריאות
              </li>
              <li>
                <b>13:00</b> <br /> ועדת חוץ וביטחון
              </li>
            </ul>
          </section>
          <section className="Schedule-section" id="Events">
            <ul>
              <li>
                <b>11:00</b> <span>אירוע</span> <br /> יום המאבק בעוני מטעם חה"כ
                אתי חוה אטייה
              </li>
            </ul>
          </section>
        </main>
        <footer className="Component-footer">
          <div>
            <a href="#" className="expand-component">
              <p>ללו"ז המלא</p>
              <img src="Schedule-arrow.png" alt="arrow" />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
