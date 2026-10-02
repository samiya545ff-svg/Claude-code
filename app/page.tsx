"use client";

import Stats from "@/components/dashboard/Stats";
import ProfileCard from "@/components/dashboard/ProfileCard";
import Progress from "@/components/dashboard/Progress";
import TimeTracker from "@/components/dashboard/TimeTracker";
import Onboarding from "@/components/dashboard/Onboarding";
import Details from "@/components/dashboard/Details";
import WeekCalendar from "@/components/WeekCalendar";
import { useStore } from "@/lib/store";

export default function Dashboard() {
  const { state } = useStore();
  return (
    <>
      <h1 className="welcome">Welcome in, {state.user.name.split(" ")[0]}</h1>
      <Stats />
      <div className="grid">
        <div className="a-profile">
          <ProfileCard />
        </div>
        <div className="a-progress">
          <Progress />
        </div>
        <div className="a-tracker">
          <TimeTracker />
        </div>
        <div className="a-onboarding">
          <Onboarding />
        </div>
        <div className="a-details">
          <Details />
        </div>
        <div className="a-calendar card">
          <WeekCalendar compact from={8} to={12} rowHeight={40} />
        </div>
      </div>
    </>
  );
}
