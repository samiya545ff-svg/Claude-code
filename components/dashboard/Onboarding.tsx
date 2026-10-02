"use client";

import { useState } from "react";
import Icon from "../Icon";
import { TaskIcon, useStore } from "@/lib/store";

const ICONS: TaskIcon[] = ["monitor", "bolt", "chat", "pen", "link"];

export default function Onboarding() {
  const { state, update, uid } = useStore();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  // Split the bar into: completed (yellow), today's open tasks (dark), later tasks (grey)
  const todayKey = new Date().toLocaleString("en-US", { month: "short" }) + " " + new Date().getDate() + ",";
  const openToday = state.tasks.filter((t) => !t.done && t.date.startsWith(todayKey)).length;
  const later = total - done - openToday;
  const share = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const segs = [
    { n: done, pct: share(done), cls: "ob-yellow", label: "Task" },
    { n: openToday, pct: share(openToday), cls: "ob-dark", label: "" },
    { n: later, pct: share(later), cls: "ob-grey", label: "" },
  ];

  const toggle = (id: string) =>
    update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  const remove = (id: string) => update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const d = new Date();
    const date = `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}, ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
    update((s) => ({
      ...s,
      tasks: [...s.tasks, { id: uid(), title: title.trim(), date, done: false, icon: ICONS[s.tasks.length % ICONS.length] }],
    }));
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="onboarding-col">
      <div className="card onboarding">
        <div className="card-head">
          <h2>Onboarding</h2>
          <span className="big-pct">{pct}%</span>
        </div>
        <div className="ob-labels">
          {segs.map((s, i) => (
            <span key={i} style={{ flexGrow: Math.max(s.n, 0.6) }}>
              {s.pct}%
            </span>
          ))}
        </div>
        <div className="ob-bar">
          {segs.map((s, i) => (
            <div key={i} className={`ob-seg ${s.cls}`} style={{ flexGrow: Math.max(s.n, 0.6) }}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card dark-card">
        <div className="card-head">
          <h2>Onboarding Task</h2>
          <span className="big-count">
            {done}/{total}
          </span>
        </div>
        <ul className="task-list">
          {state.tasks.map((t) => (
            <li key={t.id} className={t.done ? "done" : ""}>
              <span className="task-icon">
                <Icon name={t.icon} size={14} />
              </span>
              <button className="task-body" onClick={() => toggle(t.id)}>
                <strong>{t.title}</strong>
                <small>{t.date}</small>
              </button>
              <button className="task-del" onClick={() => remove(t.id)} aria-label={`Delete ${t.title}`}>
                <Icon name="x" size={12} />
              </button>
              <button className={`check ${t.done ? "on" : ""}`} onClick={() => toggle(t.id)} aria-label="Toggle done">
                {t.done && <Icon name="check" size={11} />}
              </button>
            </li>
          ))}
        </ul>
        {adding ? (
          <form onSubmit={add} className="task-add">
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task…" />
            <button type="submit" className="circle-btn primary" aria-label="Add">
              <Icon name="check" size={13} />
            </button>
            <button type="button" className="circle-btn" onClick={() => setAdding(false)} aria-label="Cancel">
              <Icon name="x" size={13} />
            </button>
          </form>
        ) : (
          <button className="add-task-btn" onClick={() => setAdding(true)}>
            <Icon name="plus" size={13} /> Add task
          </button>
        )}
      </div>
    </div>
  );
}
