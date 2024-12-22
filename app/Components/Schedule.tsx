export default function Schedule() {
  return (
    <>
      <div className="Component" id="Schedule">
        <header className="schedule-header">
          <h1>סדר יום</h1>
          <a href="#">
            <img src="Share-icon.png" alt="Share icon" />
          </a>
        </header>
        <main>
          <section className="Schedule-section" id="Comeeties">
            <div>
              <h1 id="schedule-commitee-number">8</h1>
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
        <footer>
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
