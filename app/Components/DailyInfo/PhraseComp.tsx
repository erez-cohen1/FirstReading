export default function PhraseComp({ name, content }: { name: string; content: string }) {
  return (
    <div className="schedule-event-cell-opened" id="phrase-summary">
      <details>
        <summary>
          <div>
            <h4>{name}</h4>
          </div>
          <i className="arrow down white"></i>
        </summary>
        <p className={`schedule-event-description daily-info-description`}>{content}</p>
      </details>
    </div>
  );
}
