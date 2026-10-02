"use client";

import Icon from "../Icon";
import { trackerSeconds, useNow, useStore } from "@/lib/store";

export default function Stats() {
  const { state } = useStore();
  const now = useNow(!!state.tracker.startedAt);
  const total = state.candidates.length || 1;
  const pct = (n: number) => Math.round(n);

  const interviews = pct((state.candidates.filter((c) => c.stage === "Interview").length / total) * 100);
  const hired = pct((state.candidates.filter((c) => c.stage === "Hired").length / total) * 100);
  const weekSecs = state.week.reduce((a, b) => a + b, 0) + trackerSeconds(state.tracker, now);
  const projectTime = Math.min(100, pct((weekSecs / 3600 / 40) * 100));
  const output = pct((state.tasks.filter((t) => t.done).length / (state.tasks.length || 1)) * 100);

  const bars = [
    { label: "Interviews", value: interviews, cls: "seg-dark" },
    { label: "Hired", value: hired, cls: "seg-yellow" },
    { label: "Project time", value: projectTime, cls: "seg-striped" },
    { label: "Output", value: output, cls: "seg-outline" },
  ];

  return (
    <section className="stats">
      <div className="segments">
        {bars.map((b) => (
          <div key={b.label} className="segment" style={{ flexGrow: Math.max(b.value, 12) }}>
            <span className="seg-label">{b.label}</span>
            <div className={`seg-bar ${b.cls}`}>{b.value}%</div>
          </div>
        ))}
      </div>
      <div className="counters">
        <Counter icon="users" value={state.people.length} label="Employe" />
        <Counter icon="user" value={state.candidates.length} label="Hirings" />
        <Counter icon="briefcase" value={state.projects} label="Projects" />
      </div>
    </section>
  );
}

function Counter({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="counter">
      <div className="counter-num">
        <span className="counter-icon">
          <Icon name={icon} size={12} />
        </span>
        {value}
      </div>
      <span className="counter-label">{label}</span>
    </div>
  );
}
