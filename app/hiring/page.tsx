"use client";

import { useState } from "react";
import PageHead from "@/components/PageHead";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import { Stage, useStore } from "@/lib/store";

const STAGES: Stage[] = ["Applied", "Interview", "Offer", "Hired"];

export default function HiringPage() {
  const { state, update, uid } = useStore();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const move = (id: string, dir: number) =>
    update((s) => {
      const c = s.candidates.find((x) => x.id === id)!;
      const next = STAGES[STAGES.indexOf(c.stage) + dir];
      if (!next) return s;
      return {
        ...s,
        candidates: s.candidates.map((x) => (x.id === id ? { ...x, stage: next } : x)),
        notifications: [{ id: uid(), text: `${c.name} moved to ${next}`, time: "just now", read: false }, ...s.notifications].slice(0, 20),
      };
    });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    update((s) => ({ ...s, candidates: [...s.candidates, { id: uid(), name: name.trim(), role: role.trim(), stage: "Applied" }] }));
    setName("");
    setRole("");
  };

  return (
    <>
      <PageHead title="Hiring" sub="Move candidates through the pipeline. Dashboard percentages update live." />
      <form className="card toolbar" onSubmit={add}>
        <input className="input" placeholder="Candidate name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <button className="btn">
          <Icon name="plus" size={14} /> Add candidate
        </button>
      </form>
      <div className="kanban">
        {STAGES.map((st, si) => {
          const items = state.candidates.filter((c) => c.stage === st);
          return (
            <div key={st} className={`card kanban-col ${st === "Hired" ? "dark-card" : ""}`}>
              <div className="card-head">
                <h2>{st}</h2>
                <span className="count-pill">{items.length}</span>
              </div>
              {items.map((c) => (
                <div key={c.id} className="kanban-item">
                  <Avatar name={c.name} size={30} />
                  <div className="grow">
                    <strong>{c.name}</strong>
                    <small>{c.role}</small>
                  </div>
                  <div className="row gap4">
                    {si > 0 && (
                      <button className="mini-btn" onClick={() => move(c.id, -1)} aria-label="Move back">
                        <Icon name="left" size={13} />
                      </button>
                    )}
                    {si < STAGES.length - 1 && (
                      <button className="mini-btn" onClick={() => move(c.id, 1)} aria-label="Move forward">
                        <Icon name="right" size={13} />
                      </button>
                    )}
                    <button
                      className="mini-btn"
                      onClick={() => update((s) => ({ ...s, candidates: s.candidates.filter((x) => x.id !== c.id) }))}
                      aria-label="Remove"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="muted small">Empty</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}
