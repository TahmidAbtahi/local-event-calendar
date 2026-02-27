/**
 * Fetches events from the Google Apps Script web app endpoint.
 * Returns JSON with date, name, and url (hyperlink) for each row.
 * Falls back to CSV link-mappings for events without hyperlinks.
 */

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyUF6Uq8D6OhG8z_ue3Y1ur0RW_78k7XAZDQVAPDmhr7SHbOZHEKleIqURRY-hGhatI/exec";

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

/**
 * Parse the JS Date.toString() format from Apps Script:
 * "Mon Feb 02 2026 00:00:00 GMT-0500 (Eastern Standard Time)"
 * Returns "2026-02-02" or null
 */
function parseAppsScriptDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Parse the link-mappings CSV into an array of { keyword, url, priority }
 */
function parseLinkMappingsCSV(csv) {
  const lines = csv.trim().split("\n");
  const mappings = [];
  // Skip header row
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
  // Sort by priority (lower = more specific = checked first)
  mappings.sort((a, b) => a.priority - b.priority);
  return mappings;
}

/**
 * Given an event name and link mappings, find the best matching URL.
 * Priority 1 = exact match, Priority 2+ = keyword contains (case-insensitive)
 */
function findFallbackUrl(eventName, mappings) {
  const lower = eventName.toLowerCase().trim();
  for (const m of mappings) {
    if (m.priority === 1) {
      // Exact match (case-insensitive)
      if (lower === m.keyword.toLowerCase().trim()) return m.url;
    } else {
      // Keyword contains match
      if (lower.includes(m.keyword.toLowerCase().trim())) return m.url;
    }
  }
  return "";
}

/**
 * Fetch link mappings CSV from /link-mappings.csv
 */
async function fetchLinkMappings(baseUrl) {
  try {
    const url = baseUrl
      ? `${baseUrl}/link-mappings.csv`
      : "/link-mappings.csv";
    const res = await fetch(url, { cache: "no-store" });
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
    // Fetch events from Apps Script
    const res = await fetch(APPS_SCRIPT_URL, {
      cache: "no-store",
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Apps Script fetch failed: ${res.status}`);
    const raw = await res.json();

    // Fetch link mappings CSV
    const mappings = await fetchLinkMappings(baseUrl);

    const events = [];
    let lastDate = null;

    for (const row of raw) {
      const name = (row.name || "").trim();
      if (!name) {
        // Track the last valid date for continuation rows (empty date col)
        const parsed = parseAppsScriptDate(row.date);
        if (parsed) lastDate = parsed;
        continue;
      }

      let date = parseAppsScriptDate(row.date);
      // Continuation row: empty date means same as previous
      if (!date && lastDate) {
        date = lastDate;
      }
      if (!date) continue;

      lastDate = date;

      // Use hyperlink from sheet if available, otherwise fallback to CSV mappings
      let url = (row.url || "").trim();
      if (!url && mappings.length > 0) {
        url = findFallbackUrl(name, mappings);
      }

      events.push({
        date,
        name,
        type: classifyEvent(name),
        url,
      });
    }

    return events;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
}
