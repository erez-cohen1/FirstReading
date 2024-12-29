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
              <p>ללו"ז המלא</p>
              <img src="Schedule-arrow.png" alt="arrow" />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
