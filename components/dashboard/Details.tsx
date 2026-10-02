"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "../Icon";
import { useStore } from "@/lib/store";

export default function Details() {
  const { state } = useStore();
  const [open, setOpen] = useState<string | null>("Devices");
  const n = state.people.length;
  const p = n ? state.people[((state.user.featured % n) + n) % n] : null;
  const devices = state.devices.filter((d) => p && d.assignee === p.name);

  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "Pension contributions",
      body: p ? (
        <div className="kv">
          <span>Employee (5%)</span>
          <strong>${(p.salary * 0.05).toFixed(0)}/mo</strong>
          <span>Employer (7%)</span>
          <strong>${(p.salary * 0.07).toFixed(0)}/mo</strong>
        </div>
      ) : null,
    },
    {
      title: "Devices",
      body: devices.length ? (
        devices.map((d) => (
          <div key={d.id} className="device">
            <div className="laptop" />
            <div>
              <strong>{d.name}</strong>
              <small>{d.version}</small>
            </div>
            <Link href="/devices" className="icon-link" aria-label="Manage devices">
              <Icon name="dots" />
            </Link>
          </div>
        ))
      ) : (
        <p className="muted small">
          No devices assigned. <Link href="/devices">Assign one</Link>
        </p>
      ),
    },
    {
      title: "Compensation Summary",
      body: p ? (
        <div className="kv">
          <span>Base salary</span>
          <strong>${p.salary.toLocaleString()}/mo</strong>
          <span>Annual</span>
          <strong>${(p.salary * 12).toLocaleString()}</strong>
        </div>
      ) : null,
    },
    {
      title: "Employee Benefits",
      body: (
        <ul className="benefits">
          <li>Health insurance</li>
          <li>20 days paid leave</li>
          <li>Learning budget $500/yr</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="card details">
      {sections.map((s) => (
        <div key={s.title} className={`acc ${open === s.title ? "open" : ""}`}>
          <button className="acc-head" onClick={() => setOpen(open === s.title ? null : s.title)}>
            {s.title}
            <Icon name="chevron" />
          </button>
          {open === s.title && <div className="acc-body">{s.body}</div>}
        </div>
      ))}
    </div>
  );
}
