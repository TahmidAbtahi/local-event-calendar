/**
 * Fetches events from the original Google Sheet CSV export.
 * Links come from link-mappings.csv fallback since CSV strips hyperlinks.
 */

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1YHB3_Qgpo4lu7fCcDGJ5JwF-NBKxbqX2YjcxSTZa5EE/export?format=csv&gid=559538023";

// Keywords to classify event types
const FESTIVAL_KEYWORDS = [
  "weekender", "festival", "zouk heat", "bz weekender",
  "zouk fire weekend", "summer zouk fire",
];
const SOCIAL_KEYWORDS = [
  "social", "maison rouge", "la cosecha", "zouk fire social",
  "zouk fire party", "nye zouk", "hart of zouk", "community welcome",
];

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

function parseDateCell(cell, currentYear) {
  if (!cell) return null;
  const match = cell.match(/^(\d{1,2})\/(\d{1,2})[\/\s]?\s*\w{3}/);
  if (match) {
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    return `${currentYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
  if (match && months[match[1].toLowerCase()]) {
    return { month: months[match[1].toLowerCase()], year: parseInt(match[2], 10) };
  }
  return null;
}

function parseLinkMappingsCSV(csv) {
  const lines = csv.trim().split("\n");
  const mappings = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length >= 3) {
      mappings.push({
        keyword: parts[0].trim(),
        url: parts[1].trim(),
        priority: parseInt(parts[2].trim(), 10) || 99,
      });
    }
  }
  mappings.sort((a, b) => a.priority - b.priority);
  return mappings;
}

function findFallbackUrl(eventName, mappings) {
  const lower = eventName.toLowerCase().trim();
  for (const m of mappings) {
    if (m.priority === 1) {
      if (lower === m.keyword.toLowerCase().trim()) return m.url;
    } else {
      if (lower.includes(m.keyword.toLowerCase().trim())) return m.url;
    }
  }
  return "";
}

async function fetchLinkMappings(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/link-mappings.csv`, { cache: "no-store" });
    if (!res.ok) return [];
    const csv = await res.text();
    return parseLinkMappingsCSV(csv);
  } catch (err) {
    console.error("Failed to fetch link mappings:", err);
    return [];
  }
}

export async function fetchEvents(baseUrl) {
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();

    const mappings = await fetchLinkMappings(baseUrl);
    const lines = csv.split("\n");
    const events = [];
    let currentYear = 2026;
    let lastDate = null;

    for (const line of lines) {
      const cols = parseCSVLine(line);
      const cellA = cols[0] || "";
      const cellB = cols[1] || "";

      const monthHeader = parseMonthHeader(cellA);
      if (monthHeader) {
        currentYear = monthHeader.year;
        continue;
      }

      const date = parseDateCell(cellA, currentYear);
      if (date && cellB) {
        lastDate = date;
        events.push({
          date,
          name: cellB,
          type: classifyEvent(cellB),
          url: findFallbackUrl(cellB, mappings),
        });
      }

      if (!cellA && cellB && lastDate) {
        events.push({
          date: lastDate,
          name: cellB,
          type: classifyEvent(cellB),
          url: findFallbackUrl(cellB, mappings),
        });
      }
    }

    return events;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
}
