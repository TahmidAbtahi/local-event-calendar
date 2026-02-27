import { fetchEvents } from "@/lib/sheets";
import { FALLBACK_EVENTS } from "@/lib/fallback-events";
import CalendarApp from "./CalendarApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  const events = await fetchEvents("https://dmv-zouk-calendar.vercel.app");
  const usedFallback = events.length === 0;
  return <CalendarApp events={usedFallback ? FALLBACK_EVENTS : events} usedFallback={usedFallback} />;
}
