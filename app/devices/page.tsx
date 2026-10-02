"use client";

import { useState } from "react";
import PageHead from "@/components/PageHead";
import Icon from "@/components/Icon";
import { Device, useStore } from "@/lib/store";

const STATUSES: Device["status"][] = ["In use", "Available", "Repair"];

export default function DevicesPage() {
  const { state, update, uid } = useStore();
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");

  const patch = (id: string, p: Partial<Device>) =>
    update((s) => ({ ...s, devices: s.devices.map((d) => (d.id === id ? { ...d, ...p } : d)) }));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    update((s) => ({
      ...s,
      devices: [...s.devices, { id: uid(), name: name.trim(), version: version.trim(), assignee: "", status: "Available" }],
    }));
    setName("");
    setVersion("");
  };

  return (
    <>
      <PageHead title="Devices" sub="Assign hardware to employees. Assigned devices show up on the dashboard." />
      <form className="card toolbar" onSubmit={add}>
        <input className="input" placeholder="Device name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Version / model" value={version} onChange={(e) => setVersion(e.target.value)} />
        <button className="btn">
          <Icon name="plus" size={14} /> Add device
        </button>
      </form>
      <div className="tiles">
        {state.devices.map((d) => (
          <div key={d.id} className="card tile">
            <div className="laptop big" />
            <div className="card-head">
              <div>
                <h2>{d.name}</h2>
                <span className="muted small">{d.version}</span>
              </div>
              <button
                className="mini-btn"
                aria-label="Delete device"
                onClick={() => update((s) => ({ ...s, devices: s.devices.filter((x) => x.id !== d.id) }))}
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
            <label className="field">
              Assignee
              <select
                value={d.assignee}
                onChange={(e) => patch(d.id, { assignee: e.target.value, status: e.target.value ? "In use" : "Available" })}
              >
                <option value="">— Unassigned —</option>
                {state.people.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Status
              <select value={d.status} onChange={(e) => patch(d.id, { status: e.target.value as Device["status"] })}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
