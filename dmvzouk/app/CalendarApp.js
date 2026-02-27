"use client";

import { useState, useMemo } from "react";

const TYPE_CONFIG = {
  social: { label: "Social", color: "#E8475F", bg: "rgba(232,71,95,0.12)", border: "rgba(232,71,95,0.3)" },
  class: { label: "Class", color: "#2D9CDB", bg: "rgba(45,156,219,0.12)", border: "rgba(45,156,219,0.3)" },
  festival: { label: "Weekender / Festival", color: "#F2994A", bg: "rgba(242,153,74,0.12)", border: "rgba(242,153,74,0.3)" },
};

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

const isToday = (y, m, d) => {
  const now = new Date();
  return now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
};

function EventCard({ event }) {
  const cfg = TYPE_CONFIG[event.type];
  const hasLink = !!event.url;

  const content = (
    <div style={{
      padding: "14px 16px", borderRadius: "12px", background: cfg.bg,
      borderLeft: `3px solid ${cfg.color}`,
      cursor: hasLink ? "pointer" : "default",
      transition: "all 0.2s ease",
      position: "relative",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "10px", fontWeight: 600, color: cfg.color,
            letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px",
          }}>
            {cfg.label}
          </div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#e8e4ef" }}>
            {event.name}
          </div>
        </div>
        {hasLink && (
          <div style={{
            fontSize: "11px", color: cfg.color, opacity: 0.7,
            marginLeft: "10px", marginTop: "2px", flexShrink: 0,
          }}>
            ↗
          </div>
        )}
      </div>
    </div>
  );

  if (hasLink) {
    return (
      <a href={event.url} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}>
        {content}
      </a>
    );
  }
  return content;
}

function UpcomingCard({ event, onClick }) {
  const cfg = TYPE_CONFIG[event.type];
  const d = new Date(event.date + "T12:00:00");
  const hasLink = !!event.url;

  return (
    <div onClick={onClick} style={{
      padding: "14px 16px", borderRadius: "14px",
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
      cursor: "pointer", transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
          <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(232,228,239,0.4)", letterSpacing: "1px", textTransform: "uppercase" }}>
            {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>
        {hasLink && (
          <a href={event.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: "10px", color: cfg.color, opacity: 0.6,
              textDecoration: "none", padding: "2px 6px",
              borderRadius: "4px", border: `1px solid ${cfg.color}33`,
            }}>
            Details ↗
          </a>
        )}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8e4ef", lineHeight: 1.4, paddingLeft: "15px" }}>
        {event.name}
      </div>
    </div>
  );
}

export default function CalendarApp({ events, usedFallback = false }) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState("all");

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
    const todayStr = now.toISOString().slice(0, 10);
    return events
      .filter((e) => e.date >= todayStr && (filter === "all" || e.type === filter))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  }, [events, filter]);

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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a12 0%, #12101f 40%, #1a0f1a 100%)",
      padding: 0, overflow: "auto",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(232,71,95,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", left: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(45,156,219,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", padding: "6px 18px", borderRadius: "100px",
            background: "rgba(232,71,95,0.15)", border: "1px solid rgba(232,71,95,0.25)",
            fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase",
            color: "#E8475F", marginBottom: "20px",
          }}>DC Metro Area</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700, margin: "0 0 10px", lineHeight: 1.1,
            background: "linear-gradient(135deg, #fff 0%, #c4b5d0 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Brazilian Zouk</h1>
          <p style={{
            fontSize: "15px", color: "rgba(232,228,239,0.5)", fontWeight: 300,
            letterSpacing: "4px", textTransform: "uppercase", margin: 0,
          }}>Calendar of Events</p>
          <p style={{
            fontSize: "11px", color: "rgba(232,228,239,0.25)", marginTop: "12px",
            fontStyle: "italic",
          }}>{usedFallback ? "Showing cached events — live sync will activate once the Google Sheet is published to web" : "Auto-synced from the community Google Sheet"}</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "36px", flexWrap: "wrap" }}>
          {[
            { key: "all", label: "All Events", color: "#e8e4ef" },
            ...Object.entries(TYPE_CONFIG).map(([k, v]) => ({ key: k, label: v.label, color: v.color })),
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "8px 20px", borderRadius: "100px", border: "1px solid",
              borderColor: filter === f.key ? f.color : "rgba(255,255,255,0.1)",
              background: filter === f.key ? `${f.color}22` : "rgba(255,255,255,0.03)",
              color: filter === f.key ? f.color : "rgba(232,228,239,0.5)",
              fontSize: "13px", fontWeight: 500, transition: "all 0.25s ease",
            }}>
              <span style={{
                display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
                background: f.key === "all" ? "linear-gradient(135deg, #E8475F, #2D9CDB, #F2994A)" : f.color,
                marginRight: "8px", verticalAlign: "middle",
              }} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>
          {/* Calendar Grid */}
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.06)", padding: "28px",
            backdropFilter: "blur(20px)",
          }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <button onClick={() => navigate(-1)} style={{
                width: "40px", height: "40px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)", color: "#e8e4ef", fontSize: "18px",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}>←</button>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, margin: 0 }}>
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <button onClick={goToToday} style={{
                  background: "none", border: "none", color: "#E8475F", fontSize: "11px",
                  fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px", cursor: "pointer",
                }}>Today</button>
              </div>
              <button onClick={() => navigate(1)} style={{
                width: "40px", height: "40px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)", color: "#e8e4ef", fontSize: "18px",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}>→</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
              {DAYS.map((d) => (
                <div key={d} style={{
                  textAlign: "center", fontSize: "11px", fontWeight: 600,
                  color: "rgba(232,228,239,0.35)", letterSpacing: "1.5px", textTransform: "uppercase",
                  padding: "8px 0",
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
                    borderColor: isSelected ? "rgba(232,71,95,0.5)" : today ? "rgba(232,71,95,0.3)" : "rgba(255,255,255,0.04)",
                    background: isSelected ? "rgba(232,71,95,0.15)" : today ? "rgba(232,71,95,0.06)" : hasEvents ? "rgba(255,255,255,0.04)" : "transparent",
                    color: isSelected || today ? "#fff" : hasEvents ? "#e8e4ef" : "rgba(232,228,239,0.4)",
                    fontSize: "15px", fontWeight: today || isSelected ? 700 : 400,
                    cursor: hasEvents ? "pointer" : "default",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "5px", transition: "all 0.2s ease", position: "relative", padding: "4px",
                    fontFamily: "inherit",
                  }}>
                    {today && (
                      <div style={{
                        position: "absolute", top: "5px", right: "5px", width: "5px", height: "5px",
                        borderRadius: "50%", background: "#E8475F",
                      }} />
                    )}
                    <span>{day}</span>
                    {hasEvents && (
                      <div style={{ display: "flex", gap: "3px" }}>
                        {types.map((t) => (
                          <div key={t} style={{
                            width: "5px", height: "5px", borderRadius: "50%",
                            background: TYPE_CONFIG[t]?.color || "#fff",
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
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                animation: "fadeIn 0.2s ease",
              }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 16px", color: "rgba(232,228,239,0.6)", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h3>
                {filteredEvents.length === 0 ? (
                  <p style={{ color: "rgba(232,228,239,0.4)", fontSize: "14px", margin: 0 }}>
                    No events this day{filter !== "all" ? " (with current filter)" : ""}.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filteredEvents.map((e, idx) => (
                      <EventCard key={idx} event={e} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.06)", padding: "28px",
            backdropFilter: "blur(20px)", position: "sticky", top: "20px",
          }}>
            {events.length === 0 && (
              <div style={{
                padding: "20px", borderRadius: "12px", background: "rgba(242,153,74,0.1)",
                border: "1px solid rgba(242,153,74,0.2)", marginBottom: "20px",
                fontSize: "13px", color: "#F2994A", lineHeight: 1.5,
              }}>
                ⚠️ Could not load events. Using cached data.
              </div>
            )}
            <h3 style={{
              fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase",
              color: "rgba(232,228,239,0.45)", margin: "0 0 20px",
            }}>Upcoming Events</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {upcomingEvents.length === 0 ? (
                <p style={{ color: "rgba(232,228,239,0.3)", fontSize: "13px" }}>No upcoming events with this filter.</p>
              ) : upcomingEvents.map((e, idx) => {
                const d = new Date(e.date + "T12:00:00");
                return (
                  <UpcomingCard key={idx} event={e} onClick={() => {
                    setCurrentMonth(d.getMonth());
                    setCurrentYear(d.getFullYear());
                    setSelectedDate(e.date);
                  }} />
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(232,228,239,0.35)", margin: "0 0 14px" }}>Legend</h4>
              {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "24px", height: "8px", borderRadius: "4px", background: v.color }} />
                  <span style={{ fontSize: "12px", color: "rgba(232,228,239,0.6)", fontWeight: 500 }}>{v.label}</span>
                </div>
              ))}
            </div>

            {/* Source */}
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <a href="https://docs.google.com/spreadsheets/d/1YHB3_Qgpo4lu7fCcDGJ5JwF-NBKxbqX2YjcxSTZa5EE/edit?pli=1&gid=559538023#gid=559538023"
                target="_blank" rel="noopener noreferrer" style={{
                  fontSize: "11px", color: "rgba(232,228,239,0.35)", display: "flex", alignItems: "center", gap: "6px",
                }}>
                📊 View source spreadsheet →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover { filter: brightness(1.15); }
        a:hover > div { filter: brightness(1.1); transform: translateX(2px); }
        @media (max-width: 800px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
