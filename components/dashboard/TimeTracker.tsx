"use client";

import Link from "next/link";
import Icon from "../Icon";
import { trackerSeconds, useNow, useStore } from "@/lib/store";

const GOAL = 8 * 3600;
const R = 58;
const C = 2 * Math.PI * R;

export default function TimeTracker() {
  const { state, update } = useStore();
  const running = !!state.tracker.startedAt;
  const now = useNow(running);
  const secs = trackerSeconds(state.tracker, now);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const ratio = Math.min(1, secs / GOAL);

  const start = () => update((s) => (s.tracker.startedAt ? s : { ...s, tracker: { ...s.tracker, startedAt: Date.now() } }));
  const pause = () =>
    update((s) => (s.tracker.startedAt ? { ...s, tracker: { base: trackerSeconds(s.tracker, Date.now()), startedAt: null } } : s));
  const stop = () =>
    update((s) => {
      const logged = trackerSeconds(s.tracker, Date.now());
      const week = [...s.week];
      week[new Date().getDay()] += logged;
      return { ...s, week, tracker: { base: 0, startedAt: null } };
    });

  return (
    <div className="card tracker">
      <div className="card-head">
        <h2>Time tracker</h2>
        <Link href="/calendar" className="round-btn" aria-label="Open calendar">
          <Icon name="arrow" />
        </Link>
      </div>
      <div className="ring">
        <svg viewBox="0 0 160 160">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={80 + Math.sin(a) * 74}
                y1={80 - Math.cos(a) * 74}
                x2={80 + Math.sin(a) * 70}
                y2={80 - Math.cos(a) * 70}
                className="tick"
              />
            );
          })}
          <circle cx="80" cy="80" r={R} className="ring-bg" />
          <circle
            cx="80"
            cy="80"
            r={R}
            className="ring-fg"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - ratio)}
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="ring-text">
          <strong>
            {hh}:{mm}
            <small>:{ss}</small>
          </strong>
          <span>{running ? "Tracking…" : "Work Time"}</span>
        </div>
      </div>
      <div className="tracker-controls">
        <div className="row gap8">
          <button className={`circle-btn ${running ? "" : "primary"}`} onClick={start} aria-label="Start" disabled={running}>
            <Icon name="play" size={14} />
          </button>
          <button className={`circle-btn ${running ? "primary" : ""}`} onClick={pause} aria-label="Pause" disabled={!running}>
            <Icon name="pause" size={14} />
          </button>
        </div>
        <button className="circle-btn dark" onClick={stop} aria-label="Stop and log time" title="Stop & log to today" disabled={secs === 0}>
          <Icon name="stop" size={15} />
        </button>
      </div>
    </div>
  );
}
