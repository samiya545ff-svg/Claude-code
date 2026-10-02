"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "../Icon";
import { trackerSeconds, useNow, useStore } from "@/lib/store";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX = 9 * 3600;

export const fmtHM = (secs: number) => `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;

export default function Progress() {
  const { state } = useStore();
  const now = useNow(!!state.tracker.startedAt);
  const today = new Date().getDay();
  const [selected, setSelected] = useState<number>(today);

  const values = state.week.map((v, i) => v + (i === today ? trackerSeconds(state.tracker, now) : 0));
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="card progress">
      <div className="card-head">
        <h2>Progress</h2>
        <Link href="/reviews" className="round-btn" aria-label="Open reviews">
          <Icon name="arrow" />
        </Link>
      </div>
      <div className="progress-total">
        <strong>{(total / 3600).toFixed(1)} h</strong>
        <span>
          Work Time
          <br />
          this week
        </span>
      </div>
      <div className="bars">
        {values.map((v, i) => {
          const h = Math.max(6, Math.min(100, (v / MAX) * 100));
          const active = i === selected;
          return (
            <button key={i} className="bar-col" onClick={() => setSelected(i)} title={fmtHM(v)}>
              <div className="bar-track">
                {active && <span className="bar-tip">{fmtHM(v)}</span>}
                <div className={`bar ${active ? "active" : ""} ${v === 0 ? "empty" : ""}`} style={{ height: `${h}%` }} />
              </div>
              <span className={`bar-day ${i === today ? "today" : ""}`}>{DAYS[i]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
