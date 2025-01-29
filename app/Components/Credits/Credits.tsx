import { useRef } from "react";
import useIsVisible from "../Schedule/useIsVisible";

export default function Credits() {
  const endRef = useRef<HTMLTableCellElement | null>(null);
  const isVisible = useIsVisible(endRef);
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.currentTarget as HTMLDetailsElement;

    endRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    //closing the element
    if (!target.open && !isVisible) {
      //   endRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (target.open) {
      // opening the element
      const detailsList: NodeListOf<HTMLDetailsElement> = document.querySelectorAll("details");
      // Close all other details elements.
      detailsList.forEach((details) => {
        if (details.textContent != target.textContent) {
          details.open = false;
        }
      });
    }
  };
  return (
    <>
      <main className="Component-main" id="Credits-main">
        <table className="Schedule-table">
          <tbody className={`Schedule-table-body showAll}`}>
            <tr className="info-event-row">
              <td className="info-event-cell-opened" id="Credits-cell">
                <details onToggle={handleToggle}>
                  <summary>
                    <div className="info-event-title white">
                      <h1>אודות</h1>
                    </div>
                    <i className="arrow down white" id="credit-arrow"></i>
                  </summary>
                  <div className="credits-content">
                    <div className="credits-label">
                      <p>
                        <br />
                        {`קריאה ראשונה הוא אתר המוקדש להצגת מידע מדויק ואובייקטיבי על הכנסת ופעילותה. כאן תמצאו עובדות ונתונים על
                        פעילות הכנסת שמתעדכנים מידיי יום.`}
                        <br />
                        <br />
                        {`האתר פותח במסגרת קורסי עיצוב ופיתוח מוצר באקדמייה בצלאל לאומנות
                        ועיצוב והאוניברסיטה העברית, עבור ״הסדנא לידע ציבורי״.`}
                        <br />
                        <br />
                        {`חברי.ות הפרוייקט: מירון אלגרישי, חן דגן, איתמר
                        יקותיאל, ארז כהן, איתי כץ, אלה צל`}
                      </p>
                    </div>
                    <div className="credtis-photos">
                      <div className="credits-empty-div"></div>
                      <img src="/huji_logo_blue.svg" alt="huji" />
                      <img src="/betzalel_logo_blue.svg" alt="bezalel" />
                    </div>
                  </div>
                  <div></div>
                </details>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
}
