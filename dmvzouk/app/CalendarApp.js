"use client";

import { useState, useMemo, useEffect } from "react";

// --- THEMES ---
const MIDNIGHT_ROSE = {
  name: "midnight-rose",
  bg: "linear-gradient(160deg, #0a0a12 0%, #12101f 40%, #1a0f1a 100%)",
  ambientTop: "rgba(232,71,95,0.08)",
  ambientBottom: "rgba(45,156,219,0.06)",
  titleGradient: "linear-gradient(135deg, #fff 0%, #c4b5d0 100%)",
  textPrimary: "#e8e4ef",
  textMuted: "rgba(232,228,239,0.5)",
  textFaint: "rgba(232,228,239,0.4)",
  textGhost: "rgba(232,228,239,0.25)",
  textSubtle: "rgba(232,228,239,0.35)",
  textDim: "rgba(232,228,239,0.3)",
  textVeryDim: "rgba(232,228,239,0.2)",
  textLabel: "rgba(232,228,239,0.45)",
  textLegend: "rgba(232,228,239,0.6)",
  accent: "#E8475F",
  accentBg: "rgba(232,71,95,0.15)",
  accentBorder: "rgba(232,71,95,0.25)",
  accentFaint: "rgba(232,71,95,0.06)",
  accentMedium: "rgba(232,71,95,0.3)",
  accentStrong: "rgba(232,71,95,0.5)",
  cardBg: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.06)",
  cardBorderHover: "rgba(255,255,255,0.1)",
  cellBg: "rgba(255,255,255,0.04)",
  cellBorder: "rgba(255,255,255,0.04)",
  pillBg: "rgba(255,255,255,0.03)",
  pillBorder: "rgba(255,255,255,0.1)",
  scrollThumb: "rgba(232,71,95,0.3)",
  scrollThumbHover: "rgba(232,71,95,0.5)",
  fadeBottom: "rgba(18,16,31,0.95)",
  types: {
    social: { label: "Social", color: "#E8475F", bg: "rgba(232,71,95,0.12)", glowWeak: "rgba(232,71,95,0.4)", glowStrong: "rgba(232,71,95,0.7)" },
    class: { label: "Class", color: "#2D9CDB", bg: "rgba(45,156,219,0.12)", glowWeak: "rgba(45,156,219,0.4)", glowStrong: "rgba(45,156,219,0.7)" },
    festival: { label: "Weekender / Festival", color: "#F2994A", bg: "rgba(242,153,74,0.12)", glowWeak: "rgba(242,153,74,0.4)", glowStrong: "rgba(242,153,74,0.7)" },
  },
};

const OCEAN_TEAL = {
  name: "ocean-teal",
  bg: "linear-gradient(160deg, #040d14 0%, #081820 40%, #0a1a1f 100%)",
  ambientTop: "rgba(0,210,180,0.08)",
  ambientBottom: "rgba(108,142,239,0.06)",
  titleGradient: "linear-gradient(135deg, #fff 0%, #a0e8d8 100%)",
  textPrimary: "#d0ebe6",
  textMuted: "rgba(200,230,225,0.5)",
  textFaint: "rgba(200,230,225,0.4)",
  textGhost: "rgba(200,230,225,0.25)",
  textSubtle: "rgba(200,230,225,0.35)",
  textDim: "rgba(200,230,225,0.3)",
  textVeryDim: "rgba(200,230,225,0.2)",
  textLabel: "rgba(200,230,225,0.45)",
  textLegend: "rgba(200,230,225,0.6)",
  accent: "#00D2B4",
  accentBg: "rgba(0,210,180,0.15)",
  accentBorder: "rgba(0,210,180,0.25)",
  accentFaint: "rgba(0,210,180,0.06)",
  accentMedium: "rgba(0,210,180,0.3)",
  accentStrong: "rgba(0,210,180,0.5)",
  cardBg: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.06)",
  cardBorderHover: "rgba(255,255,255,0.1)",
  cellBg: "rgba(255,255,255,0.04)",
  cellBorder: "rgba(255,255,255,0.04)",
  pillBg: "rgba(255,255,255,0.03)",
  pillBorder: "rgba(255,255,255,0.1)",
  scrollThumb: "rgba(0,210,180,0.3)",
  scrollThumbHover: "rgba(0,210,180,0.5)",
  fadeBottom: "rgba(8,24,32,0.95)",
  types: {
    social: { label: "Social", color: "#00D2B4", bg: "rgba(0,210,180,0.12)", glowWeak: "rgba(0,210,180,0.4)", glowStrong: "rgba(0,210,180,0.7)" },
    class: { label: "Class", color: "#6C8EEF", bg: "rgba(108,142,239,0.12)", glowWeak: "rgba(108,142,239,0.4)", glowStrong: "rgba(108,142,239,0.7)" },
    festival: { label: "Weekender / Festival", color: "#FFB347", bg: "rgba(255,179,71,0.12)", glowWeak: "rgba(255,179,71,0.4)", glowStrong: "rgba(255,179,71,0.7)" },
  },
};

function getTheme() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
  return weekNumber % 2 === 0 ? MIDNIGHT_ROSE : OCEAN_TEAL;
}

// --- CONSTANTS ---
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getTodayStr() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

const isToday = (y, m, d) => {
  const now = new Date();
  return now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
};

// --- COMPONENTS ---
function EventCard({ event, theme }) {
  const cfg = theme.types[event.type];
  const hasLink = !!event.url;

  const content = (
    <div style={{
      padding: "14px 16px", borderRadius: "12px", background: cfg.bg,
      borderLeft: `3px solid ${cfg.color}`,
      cursor: hasLink ? "pointer" : "default",
      transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "10px", fontWeight: 600, color: cfg.color,
            letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px",
          }}>{cfg.label}</div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: theme.textPrimary }}>{event.name}</div>
        </div>
        {hasLink && (
          <div style={{ fontSize: "11px", color: cfg.color, opacity: 0.7, marginLeft: "10px", marginTop: "2px", flexShrink: 0 }}>↗</div>
        )}
      </div>
    </div>
  );

  if (hasLink) {
    return <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>{content}</a>;
  }
  return content;
}

function UpcomingCard({ event, onClick, isEventToday, theme }) {
  const cfg = theme.types[event.type];
  const d = new Date(event.date + "T12:00:00");
  const hasLink = !!event.url;

  return (
    <div onClick={onClick} style={{
      padding: "14px 16px", borderRadius: "14px",
      background: isEventToday ? `${theme.accent}0A` : theme.cardBg,
      border: `1px solid ${isEventToday ? `${theme.accent}26` : theme.cardBorder}`,
      cursor: "pointer", transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className={isEventToday ? `today-glow-${event.type}` : ""} style={{
            width: "7px", height: "7px", borderRadius: "50%", background: cfg.color, flexShrink: 0,
          }} />
          <span style={{ fontSize: "10px", fontWeight: 600, color: theme.textFaint, letterSpacing: "1px", textTransform: "uppercase" }}>
            {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          {isEventToday && (
            <span style={{
              fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
              color: theme.accent, background: theme.accentBg, padding: "2px 8px", borderRadius: "100px",
            }}>Today</span>
          )}
        </div>
        {hasLink && (
          <a href={event.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: "10px", color: cfg.color, opacity: 0.6, textDecoration: "none",
              padding: "2px 6px", borderRadius: "4px", border: `1px solid ${cfg.color}33`,
            }}>Details ↗</a>
        )}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 500, color: theme.textPrimary, lineHeight: 1.4, paddingLeft: "15px" }}>
        {event.name}
      </div>
    </div>
  );
}

// --- MAIN ---
export default function CalendarApp({ events, usedFallback = false }) {
  const [theme, setTheme] = useState(MIDNIGHT_ROSE);
  useEffect(() => { setTheme(getTheme()); }, []);

  const now = new Date();
  const todayStr = getTodayStr();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [calendarHeight, setCalendarHeight] = useState(null);

  const eventMap = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const { firstDay, daysInMonth } = getMonthData(currentYear, currentMonth);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return [];
    const evts = eventMap[selectedDate] || [];
    if (filter === "all") return evts;
    return evts.filter((e) => e.type === filter);
  }, [selectedDate, eventMap, filter]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => e.date >= todayStr && (filter === "all" || e.type === filter))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 15);
  }, [events, filter, todayStr]);

  const navigate = (dir) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCurrentMonth(m);
    setCurrentYear(y);
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(dateKey(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // Measure calendar height
  const calendarRef = (el) => {
    if (el && el.offsetHeight !== calendarHeight) {
      setCalendarHeight(el.offsetHeight);
    }
  };

  const T = theme.types;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: 0, overflow: "auto" }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", background: `radial-gradient(circle, ${theme.ambientTop} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", left: "-100px", width: "500px", height: "500px", background: `radial-gradient(circle, ${theme.ambientBottom} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", padding: "6px 18px", borderRadius: "100px",
            background: theme.accentBg, border: `1px solid ${theme.accentBorder}`,
            fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase",
            color: theme.accent, marginBottom: "20px",
          }}>DC Metro Area</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700, margin: "0 0 10px", lineHeight: 1.1,
            background: theme.titleGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Brazilian Zouk</h1>
          <p style={{ fontSize: "15px", color: theme.textMuted, fontWeight: 300, letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>Calendar of Events</p>
          <p style={{ fontSize: "11px", color: theme.textGhost, marginTop: "12px", fontStyle: "italic" }}>
            {usedFallback ? "Showing cached events — live sync will activate once the Google Sheet is published to web" : "Auto-synced from the community Google Sheet"}
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "36px", flexWrap: "wrap" }}>
          <img src="/dancer.png" alt="" style={{
            height: "65px", width: "auto", opacity: 0.6,
            filter: `drop-shadow(0 0 12px ${theme.accent}40)`,
            marginRight: "6px", pointerEvents: "none",
          }} />
          {[
            { key: "all", label: "All Events", color: theme.textPrimary },
            ...Object.entries(T).map(([k, v]) => ({ key: k, label: v.label, color: v.color })),
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "8px 20px", borderRadius: "100px", border: "1px solid",
              borderColor: filter === f.key ? f.color : theme.pillBorder,
              background: filter === f.key ? `${f.color}22` : theme.pillBg,
              color: filter === f.key ? f.color : theme.textMuted,
              fontSize: "13px", fontWeight: 500, transition: "all 0.25s ease",
            }}>
              <span style={{
                display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
                background: f.key === "all" ? `linear-gradient(135deg, ${T.social.color}, ${T.class.color}, ${T.festival.color})` : f.color,
                marginRight: "8px", verticalAlign: "middle",
              }} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
          {/* Calendar Grid */}
          <div ref={calendarRef} style={{
            background: theme.cardBg, borderRadius: "20px",
            border: `1px solid ${theme.cardBorder}`, padding: "28px",
            backdropFilter: "blur(20px)",
          }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <button onClick={() => navigate(-1)} style={{
                width: "40px", height: "40px", borderRadius: "12px", border: `1px solid ${theme.cardBorderHover}`,
                background: theme.cellBg, color: theme.textPrimary, fontSize: "18px",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}>←</button>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, margin: 0 }}>
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <button onClick={goToToday} style={{
                  background: "none", border: "none", color: theme.accent, fontSize: "11px",
                  fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px", cursor: "pointer",
                }}>Today</button>
              </div>
              <button onClick={() => navigate(1)} style={{
                width: "40px", height: "40px", borderRadius: "12px", border: `1px solid ${theme.cardBorderHover}`,
                background: theme.cellBg, color: theme.textPrimary, fontSize: "18px",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}>→</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
              {DAYS.map((d) => (
                <div key={d} style={{
                  textAlign: "center", fontSize: "11px", fontWeight: 600,
                  color: theme.textSubtle, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 0",
                }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dk = dateKey(currentYear, currentMonth, day);
                const dayEvents = (eventMap[dk] || []).filter((e) => filter === "all" || e.type === filter);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDate === dk;
                const today = isToday(currentYear, currentMonth, day);
                const types = [...new Set(dayEvents.map((e) => e.type))];

                return (
                  <button key={day} onClick={() => hasEvents && setSelectedDate(isSelected ? null : dk)} style={{
                    aspectRatio: "1", borderRadius: "14px", border: "1px solid",
                    borderColor: isSelected ? theme.accentStrong : today ? theme.accentMedium : theme.cellBorder,
                    background: isSelected ? theme.accentBg : today ? theme.accentFaint : hasEvents ? theme.cellBg : "transparent",
                    color: isSelected || today ? "#fff" : hasEvents ? theme.textPrimary : theme.textFaint,
                    fontSize: "15px", fontWeight: today || isSelected ? 700 : 400,
                    cursor: hasEvents ? "pointer" : "default",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "5px", transition: "all 0.2s ease", position: "relative", padding: "4px",
                    fontFamily: "inherit",
                  }}>
                    {today && (
                      <div style={{
                        position: "absolute", top: "5px", right: "5px", width: "5px", height: "5px",
                        borderRadius: "50%", background: theme.accent,
                      }} />
                    )}
                    <span>{day}</span>
                    {hasEvents && (
                      <div style={{ display: "flex", gap: "3px" }}>
                        {types.map((t) => (
                          <div key={t} className={today ? `today-glow-${t}` : ""} style={{
                            width: "5px", height: "5px", borderRadius: "50%",
                            background: T[t]?.color || "#fff",
                          }} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected date detail */}
            {selectedDate && (
              <div style={{
                marginTop: "24px", padding: "20px", borderRadius: "16px",
                background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                animation: "fadeIn 0.2s ease",
              }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 16px", color: theme.textLegend, letterSpacing: "1px", textTransform: "uppercase" }}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h3>
                {filteredEvents.length === 0 ? (
                  <p style={{ color: theme.textFaint, fontSize: "14px", margin: 0 }}>
                    No events this day{filter !== "all" ? " (with current filter)" : ""}.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filteredEvents.map((e, idx) => <EventCard key={idx} event={e} theme={theme} />)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - scrollable, matching calendar height */}
          <div style={{
            background: theme.cardBg, borderRadius: "20px",
            border: `1px solid ${theme.cardBorder}`, padding: "28px",
            backdropFilter: "blur(20px)", position: "sticky", top: "20px",
            height: calendarHeight ? `${calendarHeight}px` : "auto",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            {events.length === 0 && (
              <div style={{
                padding: "20px", borderRadius: "12px", background: "rgba(242,153,74,0.1)",
                border: "1px solid rgba(242,153,74,0.2)", marginBottom: "20px",
                fontSize: "13px", color: "#F2994A", lineHeight: 1.5, flexShrink: 0,
              }}>⚠️ Could not load events. Using cached data.</div>
            )}
            <h3 style={{
              fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase",
              color: theme.textLabel, margin: "0 0 20px", flexShrink: 0,
            }}>Upcoming Events</h3>

            {/* Scrollable event list */}
            <div className="events-scroll" style={{
              flex: 1, overflowY: "auto", paddingRight: "8px",
              display: "flex", flexDirection: "column", gap: "12px",
            }}>
              {upcomingEvents.length === 0 ? (
                <p style={{ color: theme.textDim, fontSize: "13px" }}>No upcoming events with this filter.</p>
              ) : upcomingEvents.map((e, idx) => {
                const d = new Date(e.date + "T12:00:00");
                const isEventToday = e.date === todayStr;
                return (
                  <UpcomingCard key={idx} event={e} isEventToday={isEventToday} theme={theme} onClick={() => {
                    setCurrentMonth(d.getMonth());
                    setCurrentYear(d.getFullYear());
                    setSelectedDate(e.date);
                  }} />
                );
              })}
              {/* Spacer for fade */}
              <div style={{ height: "40px", flexShrink: 0 }} />
            </div>

            {/* Fade overlay at bottom of scroll */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
              background: `linear-gradient(to top, ${theme.fadeBottom} 0%, transparent 100%)`,
              borderRadius: "0 0 20px 20px", pointerEvents: "none",
            }} />

            {/* Legend & Source pinned at bottom */}
            <div style={{ flexShrink: 0, position: "relative", zIndex: 1, background: theme.fadeBottom, paddingTop: "8px" }}>
              <div style={{ borderTop: `1px solid ${theme.cardBorder}`, paddingTop: "16px" }}>
                <h4 style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: theme.textSubtle, margin: "0 0 10px" }}>Legend</h4>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {Object.entries(T).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "16px", height: "6px", borderRadius: "3px", background: v.color }} />
                      <span style={{ fontSize: "11px", color: theme.textLegend, fontWeight: 500 }}>{v.label}</span>
                    </div>
                  ))}
                </div>
                <a href="https://docs.google.com/spreadsheets/d/1YHB3_Qgpo4lu7fCcDGJ5JwF-NBKxbqX2YjcxSTZa5EE/edit?pli=1&gid=559538023#gid=559538023"
                  target="_blank" rel="noopener noreferrer" style={{
                    fontSize: "11px", color: theme.textSubtle, display: "flex", alignItems: "center", gap: "6px",
                  }}>📊 View source spreadsheet →</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: `1px solid ${theme.cardBorder}`,
          padding: "40px 0 32px", textAlign: "center", marginTop: "60px",
        }}>
          <p style={{ fontSize: "14px", color: theme.textLabel, lineHeight: 1.6, fontStyle: "italic", margin: "0 0 20px" }}>
            DMV Zouk Calendar exists to support and connect our local dance community.
          </p>
          <div style={{ width: "40px", height: "1px", background: theme.accentMedium, margin: "0 auto 20px" }} />
          <p style={{ fontSize: "12px", color: theme.textDim, letterSpacing: "0.5px" }}>
            Website built with care by{" "}
            <a href="https://www.facebook.com/profile.php?id=61588535387670"
              target="_blank" rel="noopener noreferrer"
              style={{ color: theme.textMuted, fontWeight: 600 }}>Heart.Bound.Coders</a>
          </p>
          <p style={{ marginTop: "12px", fontSize: "11px", color: theme.textVeryDim, letterSpacing: "1px" }}>© 2026 DMV Zouk Community</p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlowSocial {
          0%, 100% { box-shadow: 0 0 4px 2px ${T.social.glowWeak}; }
          50% { box-shadow: 0 0 12px 6px ${T.social.glowStrong}; }
        }
        @keyframes pulseGlowClass {
          0%, 100% { box-shadow: 0 0 4px 2px ${T.class.glowWeak}; }
          50% { box-shadow: 0 0 12px 6px ${T.class.glowStrong}; }
        }
        @keyframes pulseGlowFestival {
          0%, 100% { box-shadow: 0 0 4px 2px ${T.festival.glowWeak}; }
          50% { box-shadow: 0 0 12px 6px ${T.festival.glowStrong}; }
        }
        .today-glow-social { animation: pulseGlowSocial 2s ease-in-out infinite; border-radius: 50%; }
        .today-glow-class { animation: pulseGlowClass 2s ease-in-out infinite; border-radius: 50%; }
        .today-glow-festival { animation: pulseGlowFestival 2s ease-in-out infinite; border-radius: 50%; }
        button:hover { filter: brightness(1.15); }
        a:hover > div { filter: brightness(1.1); transform: translateX(2px); }
        .events-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${theme.scrollThumb} transparent;
        }
        .events-scroll::-webkit-scrollbar { width: 4px; }
        .events-scroll::-webkit-scrollbar-track { background: transparent; }
        .events-scroll::-webkit-scrollbar-thumb { background: ${theme.scrollThumb}; border-radius: 4px; }
        .events-scroll::-webkit-scrollbar-thumb:hover { background: ${theme.scrollThumbHover}; }
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
