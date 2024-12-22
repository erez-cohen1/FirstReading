import React from "react";

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="Component" id="Timeline-component">
      <section className="timeline-x-axis"></section>
      <ul id="legend">
        <li className="legend-item">
          <div className="active-day"></div>
          <div>היום</div>
        </li>
        <li className="legend-item">
          <div className="shnata"></div>
          <div>אתמול</div>
        </li>
        <li className="legend-item">
          <div className="shnata"></div>
          <div>שלשום</div>
        </li>
        <li className="legend-item">
          <div className="shnata"></div>
          <div>22.6.24</div>
        </li>
      </ul>
    </div>
  );
}
