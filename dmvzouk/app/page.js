import { fetchEvents } from "@/lib/sheets";
import CalendarApp from "./CalendarApp";
export const dynamic = "force-dynamic";
export default async function Page() {
  const events = await fetchEvents();
  return <CalendarApp events={events} />;
}
