import { fetchEvents } from "@/lib/sheets";
import { FALLBACK_EVENTS } from "@/lib/fallback-events";
import CalendarApp from "./CalendarApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Pass the base URL so the server can fetch the link-mappings.csv
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let events = await fetchEvents(baseUrl);
  const usedFallback = events.length === 0;
  if (usedFallback) events = FALLBACK_EVENTS;
  return <CalendarApp events={events} usedFallback={usedFallback} />;
}
