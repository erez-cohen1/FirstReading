"use client";

import { CommitteeEvent, CommitteeParticipant, ScheduleEventType } from "@/app/Components/Schedule/ScheduleDataTypes";
import { RefObject, use, useEffect, useMemo, useRef, useState } from "react";
import useIsVisible from "../Schedule/useIsVisible";

export default function PhraseComp({
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
    if (!target.open) {
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
      <tr>
        <td className="info-table-horizontal-separator">
          <div className="daily-info-line"></div>
        </td>
      </tr>
      <tr key={index} className="info-event-row">
        <td className="info-event-cell-opened" ref={summaryRef}>
          <details onToggle={handleToggle}>
            <summary>
              <div className="info-event-title white">
                <h3>{name}</h3>
                <p key={index} className={`info-event-description`}>
                  {content}
                </p>
              </div>
              <i className="arrow down white"></i>
            </summary>
          </details>
        </td>
      </tr>
    </>
  );
}
