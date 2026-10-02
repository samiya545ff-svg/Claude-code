"use client";

import PageHead from "@/components/PageHead";
import { useStore } from "@/lib/store";

export default function AppsPage() {
  const { state, update } = useStore();
  const on = state.apps.filter((a) => a.enabled).length;
  return (
    <>
      <PageHead title="Apps" sub={`${on} of ${state.apps.length} integrations enabled`} />
      <div className="tiles">
        {state.apps.map((a) => (
          <div key={a.id} className={`card tile app-tile ${a.enabled ? "on" : ""}`}>
            <div className="app-logo">{a.name[0]}</div>
            <div className="grow">
              <h2>{a.name}</h2>
              <span className="muted small">{a.desc}</span>
            </div>
            <button
              role="switch"
              aria-checked={a.enabled}
              aria-label={`Toggle ${a.name}`}
              className={`switch ${a.enabled ? "on" : ""}`}
              onClick={() => update((s) => ({ ...s, apps: s.apps.map((x) => (x.id === a.id ? { ...x, enabled: !x.enabled } : x)) }))}
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
