"use client";

import { CommitteeEvent, CommitteeParticipant, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { RefObject, use, useEffect, useMemo, useRef, useState } from "react";
import useIsVisible from "../Schedule/useIsVisible";

export default function DailyPhraseComp({
  isShrunk,
  index,
  content,
  name,
}: {
  isShrunk: boolean;
  index: number;
  content: string;
  name: string;
}) {
  const summaryRef = useRef<HTMLTableCellElement | null>(null);
  const isVisible = useIsVisible(summaryRef);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.currentTarget as HTMLDetailsElement;
    //closing the element
    if (!target.open && !isVisible) {
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      {index != 0 ? (
        <tr>
          <td className="info-table-horizontal-separator" ref={summaryRef}>
            <div className="daily-info-line"></div>
          </td>
        </tr>
      ) : null}
      <tr key={index} className="info-event-row">
        <td className="info-event-cell-opened">
          <details onToggle={handleToggle}>
            <summary>
              <div className="white">
                <h3>{name}</h3>
              </div>
              <i className="arrow down white"></i>
            </summary>
            <p key={index} className={`info-event-description`}>
              {content}
            </p>
          </details>
        </td>
      </tr>
    </>
  );
}
