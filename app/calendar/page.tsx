"use client";

import PageHead from "@/components/PageHead";
import WeekCalendar from "@/components/WeekCalendar";

export default function CalendarPage() {
  return (
    <>
      <PageHead title="Calendar" sub="Click an empty slot to add an event, click an event to edit it." />
      <div className="card">
        <WeekCalendar from={8} to={19} days={7} rowHeight={52} />
      </div>
    </>
  );
}
