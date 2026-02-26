import { fetchEvents } from "@/lib/sheets";
import { FALLBACK_EVENTS } from "@/lib/fallback-events";
import CalendarApp from "./CalendarApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  let events = await fetchEvents();
  const usedFallback = events.length === 0;
  if (usedFallback) events = FALLBACK_EVENTS;
  return <CalendarApp events={events} usedFallback={usedFallback} />;
}
