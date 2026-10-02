"use client";

import { useState } from "react";
import PageHead from "@/components/PageHead";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import ConfirmButton from "@/components/ConfirmButton";
import { Person, useStore } from "@/lib/store";

const STATUSES: Person["status"][] = ["Active", "Remote", "On leave"];
const blank: Omit<Person, "id"> = { name: "", role: "", dept: "", status: "Active", salary: 1000, avatar: null };

export default function PeoplePage() {
  const { state, update, uid } = useStore();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [editing, setEditing] = useState<(Omit<Person, "id"> & { id?: string }) | null>(null);
  const [photoError, setPhotoError] = useState("");

  const depts = ["All", ...Array.from(new Set(state.people.map((p) => p.dept)))];
  const list = state.people.filter(
    (p) =>
      (dept === "All" || p.dept === dept) &&
      (p.name + p.role + p.dept).toLowerCase().includes(q.toLowerCase())
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const p = { ...editing, id: editing.id ?? uid() } as Person;
    update((s) => ({
      ...s,
      people: editing.id ? s.people.map((x) => (x.id === p.id ? p : x)) : [...s.people, p],
    }));
    setEditing(null);
  };

  const onPhoto = (file?: File) => {
    if (!file || !editing) return;
    if (file.size > 400_000) return setPhotoError("Choose an image under 400 KB.");
    setPhotoError("");
    const r = new FileReader();
    r.onload = () => setEditing({ ...editing, avatar: String(r.result) });
    r.readAsDataURL(file);
  };

  return (
    <>
      <PageHead title="People" sub={`${state.people.length} employees`}>
        <button className="btn" onClick={() => setEditing({ ...blank })}>
          <Icon name="plus" size={14} /> Add employee
        </button>
      </PageHead>

      <div className="card">
        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={14} />
            <input placeholder="Search people…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="chips">
            {depts.map((d) => (
              <button key={d} className={`chip ${d === dept ? "active" : ""}`} onClick={() => setDept(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="row gap8">
                    <Avatar name={p.name} src={p.avatar} size={30} /> {p.name}
                  </div>
                </td>
                <td>{p.role}</td>
                <td>{p.dept}</td>
                <td>
                  <span className={`status s-${p.status.replace(" ", "").toLowerCase()}`}>{p.status}</span>
                </td>
                <td className="actions">
                  <button className="link-btn" onClick={() => setEditing(p)}>
                    Edit
                  </button>
                  <ConfirmButton
                    className="link-btn danger"
                    confirmText="Confirm remove"
                    onConfirm={() => update((s) => ({ ...s, people: s.people.filter((x) => x.id !== p.id) }))}
                  >
                    Remove
                  </ConfirmButton>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="muted center">
                  No matches
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "Edit employee" : "Add employee"} onClose={() => setEditing(null)}>
          <form className="form" onSubmit={save}>
            <div className="row gap8">
              <Avatar name={editing.name || "?"} src={editing.avatar} size={48} />
              <label className="btn ghost file">
                Upload photo
                <input type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} />
              </label>
              {editing.avatar && (
                <button type="button" className="link-btn" onClick={() => setEditing({ ...editing, avatar: null })}>
                  Remove photo
                </button>
              )}
            </div>
            {photoError && <p className="form-error">{photoError}</p>}
            <label>
              Name
              <input required autoFocus value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </label>
            <div className="form-row">
              <label>
                Role
                <input required value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </label>
              <label>
                Department
                <input required value={editing.dept} onChange={(e) => setEditing({ ...editing, dept: e.target.value })} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Status
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Person["status"] })}>
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Monthly salary ($)
                <input
                  type="number"
                  min={0}
                  required
                  value={editing.salary}
                  onChange={(e) => setEditing({ ...editing, salary: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
