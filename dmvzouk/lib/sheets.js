/**
 * Fetches and parses the DMVZOUK Google Sheet CSV into structured event data.
 * The sheet has a specific format:
 * - Column A: date strings like "2/1/Sun" or "2/1 Sun" or month headers like "February 2026"
 * - Column B: event name (may be empty)
 * 
 * Event types are inferred from the event name keywords.
 */

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1YHB3_Qgpo4lu7fCcDGJ5JwF-NBKxbqX2YjcxSTZa5EE/export?format=csv&gid=559538023";

// Keywords to classify event types
const FESTIVAL_KEYWORDS = ["weekender", "festival", "zouk heat", "bz weekender"];
const SOCIAL_KEYWORDS = ["social", "maison rouge", "la cosecha"];
// Everything else with content = class

function classifyEvent(name) {
  const lower = name.toLowerCase();
  if (FESTIVAL_KEYWORDS.some((kw) => lower.includes(kw))) return "festival";
  if (SOCIAL_KEYWORDS.some((kw) => lower.includes(kw))) return "social";
  return "class";
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseDateCell(cell, currentYear, currentMonth) {
  if (!cell) return null;

  // Try patterns like "2/1/Sun", "2/1/Mon", "2/1 Sun", "2/1 Mon"
  const match = cell.match(/^(\d{1,2})\/(\d{1,2})[\/\s]?\s*\w{3}/);
  if (match) {
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    // Use currentYear context (the sheet spans a known range)
    const year = currentYear;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { dateStr, month, day };
  }
  return null;
}

function parseMonthHeader(cell) {
  if (!cell) return null;
  const months = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  const match = cell.match(/^(\w+)\s+(\d{4})$/i);
  if (match) {
    const monthName = match[1].toLowerCase();
    const year = parseInt(match[2], 10);
    if (months[monthName]) {
      return { month: months[monthName], year };
    }
  }
  return null;
}

export async function fetchEvents() {
  try {
    const res = await fetch(SHEET_CSV_URL, { 
      cache: "no-store",
      headers: { "Accept": "text/csv" },
    });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();
    return parseEventsFromCSV(csv);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
}

export function parseEventsFromCSV(csv) {
  const lines = csv.split("\n");
  const events = [];
  let currentYear = 2026;
  let currentMonth = 1;

  for (const line of lines) {
    const cols = parseCSVLine(line);
    const cellA = cols[0] || "";
    const cellB = cols[1] || "";

    // Check if this is a month header row
    const monthHeader = parseMonthHeader(cellA);
    if (monthHeader) {
      currentYear = monthHeader.year;
      currentMonth = monthHeader.month;
      continue;
    }

    // Try to parse as a date row
    const dateInfo = parseDateCell(cellA, currentYear, currentMonth);
    if (dateInfo && cellB) {
      events.push({
        date: dateInfo.dateStr,
        name: cellB,
        type: classifyEvent(cellB),
      });
    }

    // Sometimes events span to the next row under the same date
    // (e.g., row 26 has an event under 2/18)
    // The sheet structure handles this by having empty col A with content in col B
    // We handle these by checking if colA is empty but colB has content
    // and we have a previous date context
    if (!cellA && cellB && events.length > 0) {
      const lastDate = events[events.length - 1].date;
      events.push({
        date: lastDate,
        name: cellB,
        type: classifyEvent(cellB),
      });
    }
  }

  return events;
}
