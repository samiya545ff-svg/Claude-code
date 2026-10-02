"use client";

import Link from "next/link";
import Icon from "../Icon";
import { initials } from "../Avatar";
import { useStore } from "@/lib/store";

export default function ProfileCard() {
  const { state, update } = useStore();
  const n = state.people.length;
  if (n === 0)
    return (
      <div className="card profile empty">
        <p>No employees yet.</p>
        <Link href="/people" className="pill-btn">
          Add people
        </Link>
      </div>
    );
  const idx = ((state.user.featured % n) + n) % n;
  const p = state.people[idx];
  const go = (d: number) => update((s) => ({ ...s, user: { ...s.user, featured: (idx + d + n) % n } }));

  return (
    <div className="card profile">
      {p.avatar ? (
        <img src={p.avatar} alt={p.name} className="profile-img" />
      ) : (
        <div className="profile-img placeholder">{initials(p.name)}</div>
      )}
      <div className="profile-nav">
        <button className="glass-btn" onClick={() => go(-1)} aria-label="Previous employee">
          <Icon name="left" />
        </button>
        <button className="glass-btn" onClick={() => go(1)} aria-label="Next employee">
          <Icon name="right" />
        </button>
      </div>
      <div className="profile-info">
        <div>
          <h3>{p.name}</h3>
          <span>{p.role}</span>
        </div>
        <Link href="/salary" className="salary-pill">
          ${p.salary.toLocaleString()}
        </Link>
      </div>
    </div>
  );
}
