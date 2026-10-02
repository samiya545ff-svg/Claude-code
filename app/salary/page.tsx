"use client";

import PageHead from "@/components/PageHead";
import Avatar from "@/components/Avatar";
import { useStore } from "@/lib/store";

export default function SalaryPage() {
  const { state, update } = useStore();
  const total = state.people.reduce((a, p) => a + p.salary, 0);
  const max = Math.max(1, ...state.people.map((p) => p.salary));

  const exportCsv = () => {
    const rows = [["Name", "Role", "Department", "Monthly", "Annual"], ...state.people.map((p) => [p.name, p.role, p.dept, p.salary, p.salary * 12])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "salaries.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHead title="Salary" sub="Edit monthly salaries inline.">
        <button className="btn ghost" onClick={exportCsv}>
          Export CSV
        </button>
      </PageHead>
      <div className="summary">
        <div className="card">
          <span className="muted small">Monthly payroll</span>
          <strong className="big">${total.toLocaleString()}</strong>
        </div>
        <div className="card">
          <span className="muted small">Annual payroll</span>
          <strong className="big">${(total * 12).toLocaleString()}</strong>
        </div>
        <div className="card dark-card">
          <span className="small">Average salary</span>
          <strong className="big">${state.people.length ? Math.round(total / state.people.length).toLocaleString() : 0}</strong>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th style={{ width: "35%" }}>Share</th>
              <th>Monthly ($)</th>
            </tr>
          </thead>
          <tbody>
            {state.people.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="row gap8">
                    <Avatar name={p.name} src={p.avatar} size={28} /> {p.name}
                  </div>
                </td>
                <td>{p.dept}</td>
                <td>
                  <div className="meter">
                    <div style={{ width: `${(p.salary / max) * 100}%` }} />
                  </div>
                </td>
                <td>
                  <input
                    className="input small-input"
                    type="number"
                    min={0}
                    value={p.salary}
                    onChange={(e) =>
                      update((s) => ({
                        ...s,
                        people: s.people.map((x) => (x.id === p.id ? { ...x, salary: Math.max(0, Number(e.target.value)) } : x)),
                      }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
