"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type TaskIcon = "monitor" | "bolt" | "chat" | "pen" | "link";
export type Task = { id: string; title: string; date: string; done: boolean; icon: TaskIcon };
export type CalEvent = { id: string; title: string; desc: string; date: string; start: number; end: number; people: string[] };
export type Person = { id: string; name: string; role: string; dept: string; status: "Active" | "On leave" | "Remote"; salary: number; avatar?: string | null };
export type Stage = "Applied" | "Interview" | "Offer" | "Hired";
export type Candidate = { id: string; name: string; role: string; stage: Stage };
export type Device = { id: string; name: string; version: string; assignee: string; status: "In use" | "Available" | "Repair" };
export type App = { id: string; name: string; desc: string; enabled: boolean };
export type Review = { id: string; name: string; rating: number; comment: string; date: string };
export type Notification = { id: string; text: string; time: string; read: boolean };
export type User = { name: string; role: string; email: string; company: string; featured: number };

export type State = {
  user: User;
  tasks: Task[];
  events: CalEvent[];
  people: Person[];
  candidates: Candidate[];
  devices: Device[];
  apps: App[];
  reviews: Review[];
  notifications: Notification[];
  projects: number;
  /** seconds worked per weekday, index 0 = Sunday */
  week: number[];
  tracker: { base: number; startedAt: number | null };
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function startOfWeek(d: Date) {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = r.getDay();
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1)); // Monday
  return r;
}

function seed(): State {
  const now = new Date();
  const mon = startOfWeek(now);
  const dayOf = (offset: number) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + offset);
    return ymd(d);
  };
  const taskDate = (offset: number, time: string) => {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}, ${time}`;
  };
  const h = 3600;
  return {
    user: { name: "Nixtio", role: "HR Manager", email: "nixtio@crextio.com", company: "Crextio", featured: 0 },
    tasks: [
      { id: uid(), title: "Interview", date: taskDate(0, "08:30"), done: true, icon: "monitor" },
      { id: uid(), title: "Team Meeting", date: taskDate(0, "10:30"), done: true, icon: "bolt" },
      { id: uid(), title: "Project Update", date: taskDate(0, "13:00"), done: false, icon: "chat" },
      { id: uid(), title: "Discuss Q3 Goals", date: taskDate(0, "14:45"), done: false, icon: "pen" },
      { id: uid(), title: "HR Policy Review", date: taskDate(0, "16:30"), done: false, icon: "link" },
      { id: uid(), title: "Setup Workspace", date: taskDate(1, "09:00"), done: false, icon: "monitor" },
      { id: uid(), title: "Security Training", date: taskDate(1, "11:00"), done: false, icon: "bolt" },
      { id: uid(), title: "Meet the Team", date: taskDate(2, "15:00"), done: false, icon: "chat" },
    ],
    events: [
      { id: uid(), title: "Weekly Team Sync", desc: "Discuss progress on projects", date: dayOf(1), start: 8.5, end: 9.5, people: ["AK", "JS", "MR"] },
      { id: uid(), title: "Onboarding Session", desc: "Introduction for new hires", date: dayOf(3), start: 10, end: 11, people: ["LP", "DN"] },
      { id: uid(), title: "Design Review", desc: "Dashboard v2 walkthrough", date: dayOf(4), start: 9, end: 10, people: ["NX"] },
    ],
    people: [
      { id: uid(), name: "Lora Piterson", role: "UX/UI Designer", dept: "Design", status: "Active", salary: 1200 },
      { id: uid(), name: "Arif Khan", role: "Frontend Engineer", dept: "Engineering", status: "Remote", salary: 1850 },
      { id: uid(), name: "Julia Smith", role: "Product Manager", dept: "Product", status: "Active", salary: 2100 },
      { id: uid(), name: "Marco Rossi", role: "Backend Engineer", dept: "Engineering", status: "On leave", salary: 1700 },
      { id: uid(), name: "Dana Nguyen", role: "HR Specialist", dept: "People", status: "Active", salary: 1400 },
      { id: uid(), name: "Samir Hossain", role: "QA Engineer", dept: "Engineering", status: "Remote", salary: 1550 },
    ],
    candidates: [
      { id: uid(), name: "Rafi Ahmed", role: "iOS Developer", stage: "Applied" },
      { id: uid(), name: "Emma Brown", role: "Data Analyst", stage: "Interview" },
      { id: uid(), name: "Liam Wilson", role: "DevOps Engineer", stage: "Interview" },
      { id: uid(), name: "Nadia Islam", role: "Copywriter", stage: "Offer" },
      { id: uid(), name: "Tom Becker", role: "Designer", stage: "Hired" },
      { id: uid(), name: "Sara Lee", role: "Support Lead", stage: "Applied" },
      { id: uid(), name: "Omar Faruk", role: "Backend Engineer", stage: "Applied" },
    ],
    devices: [
      { id: uid(), name: "MacBook Air", version: "Version M1", assignee: "Lora Piterson", status: "In use" },
      { id: uid(), name: "MacBook Pro 14\"", version: "Version M3", assignee: "Arif Khan", status: "In use" },
      { id: uid(), name: "Dell XPS 15", version: "2023", assignee: "", status: "Available" },
      { id: uid(), name: "iPad Pro", version: "6th gen", assignee: "", status: "Repair" },
    ],
    apps: [
      { id: uid(), name: "Slack", desc: "Team messaging", enabled: true },
      { id: uid(), name: "Google Calendar", desc: "Sync meetings", enabled: true },
      { id: uid(), name: "Figma", desc: "Design collaboration", enabled: false },
      { id: uid(), name: "GitHub", desc: "Code & reviews", enabled: true },
      { id: uid(), name: "Notion", desc: "Docs & wiki", enabled: false },
    ],
    reviews: [
      { id: uid(), name: "Lora Piterson", rating: 5, comment: "Outstanding design work on the onboarding flow.", date: taskDate(-3, "10:00") },
      { id: uid(), name: "Arif Khan", rating: 4, comment: "Shipped the dashboard ahead of schedule.", date: taskDate(-6, "15:20") },
      { id: uid(), name: "Julia Smith", rating: 4, comment: "Great roadmap communication.", date: taskDate(-9, "11:45") },
    ],
    notifications: [
      { id: uid(), text: "Emma Brown moved to Interview stage", time: "5m ago", read: false },
      { id: uid(), text: "Weekly Team Sync starts tomorrow at 8:30", time: "1h ago", read: false },
      { id: uid(), text: "Marco Rossi requested leave", time: "3h ago", read: true },
    ],
    projects: 203,
    week: [0, 6.2 * h, 7.8 * h, 4.1 * h, 6.6 * h, 8.4 * h, 0],
    tracker: { base: 2 * 3600 + 35 * 60, startedAt: null },
  };
}

const KEY = "crextio-dashboard-v1";

type Ctx = {
  state: State;
  hydrated: boolean;
  update: (fn: (s: State) => State) => void;
  reset: () => void;
  uid: () => string;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(seed);
  const [hydrated, setHydrated] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...seed(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const update = useCallback((fn: (s: State) => State) => setState(fn), []);
  const reset = useCallback(() => setState(seed()), []);

  const value = useMemo(() => ({ state, hydrated, update, reset, uid }), [state, hydrated, update, reset]);
  // Data is seeded from the current date and localStorage, so render only on the client
  // to avoid hydration mismatches with the statically prerendered HTML.
  return <StoreContext.Provider value={value}>{hydrated ? children : <div className="loading" />}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/** Re-renders every second while `active`, returning Date.now(). */
export function useNow(active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);
  return now;
}

export function trackerSeconds(t: State["tracker"], now: number) {
  return t.base + (t.startedAt ? Math.floor((now - t.startedAt) / 1000) : 0);
}
