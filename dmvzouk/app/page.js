import { fetchEvents } from "@/lib/sheets";
import CalendarApp from "./CalendarApp";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function Page() {
  const events = await fetchEvents();
  return <CalendarApp events={events} />;
}
