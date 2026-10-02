"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import ConfirmButton from "./ConfirmButton";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/people", label: "People" },
  { href: "/hiring", label: "Hiring" },
  { href: "/devices", label: "Devices" },
  { href: "/apps", label: "Apps" },
  { href: "/salary", label: "Salary" },
  { href: "/calendar", label: "Calendar" },
  { href: "/reviews", label: "Reviews" },
];

function useOutside(ref: React.RefObject<HTMLElement | null>, onOut: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, onOut]);
}

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const { state, update, reset } = useStore();
  const [open, setOpen] = useState<null | "bell" | "user" | "menu">(null);
  const wrap = useRef<HTMLDivElement>(null);
  useOutside(wrap, () => setOpen(null));
  useEffect(() => setOpen(null), [path]);

  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <header className="header" ref={wrap}>
      <Link href="/" className="logo">
        {state.user.company}
      </Link>

      <nav className={`nav ${open === "menu" ? "nav-open" : ""}`}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`nav-link ${path === n.href ? "active" : ""}`}>
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <button className="menu-btn icon-btn" onClick={() => setOpen(open === "menu" ? null : "menu")} aria-label="Menu">
          <Icon name="dots" />
        </button>
        <Link href="/settings" className={`pill-btn ${path === "/settings" ? "active" : ""}`}>
          <Icon name="gear" /> <span>Setting</span>
        </Link>

        <div className="dropdown-wrap">
          <button className="icon-btn" aria-label="Notifications" onClick={() => setOpen(open === "bell" ? null : "bell")}>
            <Icon name="bell" />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {open === "bell" && (
            <div className="dropdown">
              <div className="dropdown-head">
                <strong>Notifications</strong>
                <button
                  className="link-btn"
                  onClick={() =>
                    update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }))
                  }
                >
                  Mark all read
                </button>
              </div>
              {state.notifications.length === 0 && <p className="muted small">No notifications</p>}
              {state.notifications.map((n) => (
                <button
                  key={n.id}
                  className={`notif ${n.read ? "" : "unread"}`}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      notifications: s.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                    }))
                  }
                >
                  <span>{n.text}</span>
                  <small>{n.time}</small>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown-wrap">
          <button className="icon-btn" aria-label="Account" onClick={() => setOpen(open === "user" ? null : "user")}>
            <Icon name="user" />
          </button>
          {open === "user" && (
            <div className="dropdown">
              <div className="dropdown-head">
                <strong>{state.user.name}</strong>
                <span className="muted small">{state.user.role}</span>
              </div>
              <button className="menu-item" onClick={() => router.push("/settings")}>
                Profile & settings
              </button>
              <ConfirmButton
                className="menu-item"
                confirmText="Click again to reset all data"
                onConfirm={() => {
                  reset();
                  setOpen(null);
                }}
              >
                Reset demo data
              </ConfirmButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
