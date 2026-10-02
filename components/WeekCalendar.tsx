"use client";

import { useState } from "react";
import Icon from "./Icon";
import Avatar from "./Avatar";
import Modal from "./Modal";
import { CalEvent, startOfWeek, useStore, ymd } from "@/lib/store";

type Props = { from?: number; to?: number; days?: number; rowHeight?: number; compact?: boolean };

const fmtHour = (h: number) => {
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  const am = hr < 12 ? "am" : "pm";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${am}`;
};
const toTime = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
const fromTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h + (m || 0) / 60;
};
const month = (d: Date) => d.toLocaleString("en-US", { month: "long" });

export default function WeekCalendar({ from = 8, to = 12, days = 6, rowHeight = 40, compact = false }: Props) {
  const { state, update, uid } = useStore();
  const [anchor, setAnchor] = useState(() => new Date());
  const [editing, setEditing] = useState<Partial<CalEvent> | null>(null);

  const mon = startOfWeek(anchor);
  const cols = Array.from({ length: days }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
  const hours = Array.from({ length: to - from }, (_, i) => from + i);
  const todayKey = ymd(new Date());

  const shiftWeek = (n: number) => setAnchor((a) => new Date(a.getFullYear(), a.getMonth(), a.getDate() + n * 7));
  // A week belongs to the month its Thursday falls in (ISO convention).
  const mid = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 3);
  const toMonth = (n: number) => setAnchor(new Date(mid.getFullYear(), mid.getMonth() + n, 1));
  const prevM = new Date(mid.getFullYear(), mid.getMonth() - 1, 1);
  const nextM = new Date(mid.getFullYear(), mid.getMonth() + 1, 1);

  const visible = state.events.filter((e) => cols.some((c) => ymd(c) === e.date) && e.end > from && e.start < to);

  // In compact mode let an event stretch over following empty days, like the design.
  const spanOf = (e: CalEvent, col: number) => {
    if (!compact) return 1;
    let span = 1;
    for (let i = col + 1; i < Math.min(days, col + 3); i++) {
      const clash = visible.some((o) => o.date === ymd(cols[i]) && o.start < e.end && o.end > e.start);
      if (clash) break;
      span++;
    }
    return span;
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title?.trim() || !editing.date || editing.start == null || editing.end == null) return;
    if (editing.end <= editing.start) return alert("End time must be after start time");
    const ev: CalEvent = {
      id: editing.id ?? uid(),
      title: editing.title.trim(),
      desc: editing.desc ?? "",
      date: editing.date,
      start: editing.start,
      end: editing.end,
      people: editing.people ?? [],
    };
    update((s) => ({
      ...s,
      events: editing.id ? s.events.map((x) => (x.id === ev.id ? ev : x)) : [...s.events, ev],
    }));
    setEditing(null);
  };

  return (
    <div className={`week-cal ${compact ? "compact" : ""}`}>
      <div className="cal-head">
        <button className="month-pill" onClick={() => toMonth(-1)}>
          {month(prevM)}
        </button>
        <div className="cal-title">
          <button className="mini-btn" onClick={() => shiftWeek(-1)} aria-label="Previous week">
            <Icon name="left" size={14} />
          </button>
          <button className="title-btn" onClick={() => setAnchor(new Date())} title="Go to today">
            {month(mid)} {mid.getFullYear()}
          </button>
          <button className="mini-btn" onClick={() => shiftWeek(1)} aria-label="Next week">
            <Icon name="right" size={14} />
          </button>
        </div>
        <button className="month-pill" onClick={() => toMonth(1)}>
          {month(nextM)}
        </button>
      </div>

      <div className="cal-grid" style={{ gridTemplateColumns: `64px repeat(${days}, 1fr)` }}>
        <div />
        {cols.map((c) => (
          <div key={ymd(c)} className={`cal-day ${ymd(c) === todayKey ? "today" : ""}`}>
            <span>{c.toLocaleString("en-US", { weekday: "short" })}</span>
            <strong>{c.getDate()}</strong>
          </div>
        ))}

        <div className="cal-times">
          {hours.map((h) => (
            <div key={h} style={{ height: rowHeight }}>
              {fmtHour(h)}
            </div>
          ))}
        </div>
        {cols.map((c, ci) => (
          <div key={ymd(c)} className="cal-col" style={{ height: rowHeight * hours.length }}>
            {hours.map((h) => (
              <button
                key={h}
                className="cal-slot"
                style={{ height: rowHeight }}
                onClick={() => setEditing({ date: ymd(c), start: h, end: h + 1, title: "", desc: "" })}
                aria-label={`Add event ${ymd(c)} ${fmtHour(h)}`}
              />
            ))}
            {visible
              .filter((e) => e.date === ymd(c))
              .map((e) => {
                const top = (Math.max(e.start, from) - from) * rowHeight;
                const height = Math.max(26, (Math.min(e.end, to) - Math.max(e.start, from)) * rowHeight - 4);
                const span = spanOf(e, ci);
                const dark = e.title.length % 2 === 0;
                return (
                  <button
                    key={e.id}
                    className={`cal-event ${dark ? "dark" : "light"}`}
                    style={{ top, height: compact ? undefined : height, width: `calc(${span * 100}% - 6px)` }}
                    onClick={() => setEditing(e)}
                  >
                    <div>
                      <strong>{e.title}</strong>
                      <small>{e.desc || `${fmtHour(e.start)} – ${fmtHour(e.end)}`}</small>
                    </div>
                    <div className="stack">
                      {e.people.slice(0, 3).map((p) => (
                        <Avatar key={p} name={p} size={20} />
                      ))}
                    </div>
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit event" : "New event"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="form">
            <label>
              Title
              <input autoFocus required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </label>
            <label>
              Description
              <input value={editing.desc ?? ""} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
            </label>
            <div className="form-row">
              <label>
                Date
                <input type="date" required value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
              </label>
              <label>
                Start
                <input
                  type="time"
                  required
                  value={toTime(editing.start ?? 9)}
                  onChange={(e) => setEditing({ ...editing, start: fromTime(e.target.value) })}
                />
              </label>
              <label>
                End
                <input
                  type="time"
                  required
                  value={toTime(editing.end ?? 10)}
                  onChange={(e) => setEditing({ ...editing, end: fromTime(e.target.value) })}
                />
              </label>
            </div>
            <label>
              Attendees (initials, comma separated)
              <input
                value={(editing.people ?? []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    people: e.target.value
                      .split(",")
                      .map((x) => x.trim().toUpperCase())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <div className="form-actions">
              {editing.id && (
                <button
                  type="button"
                  className="btn ghost danger"
                  onClick={() => {
                    update((s) => ({ ...s, events: s.events.filter((x) => x.id !== editing.id) }));
                    setEditing(null);
                  }}
                >
                  Delete
                </button>
              )}
              <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
