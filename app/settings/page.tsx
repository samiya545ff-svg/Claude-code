"use client";

import { useEffect, useState } from "react";
import PageHead from "@/components/PageHead";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { state, hydrated, update, reset } = useStore();
  const [form, setForm] = useState(state.user);
  const [projects, setProjects] = useState(state.projects);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) {
      setForm(state.user);
      setProjects(state.projects);
    }
    // only sync once data has loaded from storage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update((s) => ({ ...s, user: { ...s.user, ...form }, projects }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <>
      <PageHead title="Settings" sub="Your profile and workspace preferences" />
      <form className="card form narrow" onSubmit={save}>
        <div className="form-row">
          <label>
            Your name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Role
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Company name
            <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </label>
        </div>
        <label>
          Projects count
          <input type="number" min={0} value={projects} onChange={(e) => setProjects(Number(e.target.value))} />
        </label>
        <div className="form-actions">
          {saved && <span className="saved">Saved ✓</span>}
          <button type="button" className="btn ghost danger" onClick={() => confirm("Reset all data?") && reset()}>
            Reset demo data
          </button>
          <button className="btn">Save changes</button>
        </div>
      </form>
    </>
  );
}
