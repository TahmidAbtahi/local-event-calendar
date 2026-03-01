"use client";

import { useState, useMemo, useEffect } from "react";

var MIDNIGHT_ROSE = {
  name: "midnight-rose",
  bg: "linear-gradient(160deg, #0a0a12 0%, #12101f 40%, #1a0f1a 100%)",
  ambientTop: "rgba(232,71,95,0.08)", ambientBottom: "rgba(45,156,219,0.06)",
  titleGradient: "linear-gradient(135deg, #fff 0%, #c4b5d0 100%)",
  textPrimary: "#e8e4ef", textMuted: "rgba(232,228,239,0.5)", textFaint: "rgba(232,228,239,0.4)",
  textGhost: "rgba(232,228,239,0.25)", textSubtle: "rgba(232,228,239,0.35)",
  textDim: "rgba(232,228,239,0.3)", textVeryDim: "rgba(232,228,239,0.2)",
  textLabel: "rgba(232,228,239,0.45)", textLegend: "rgba(232,228,239,0.6)",
  accent: "#E8475F", accentBg: "rgba(232,71,95,0.15)", accentBorder: "rgba(232,71,95,0.25)",
  accentFaint: "rgba(232,71,95,0.06)", accentMedium: "rgba(232,71,95,0.3)", accentStrong: "rgba(232,71,95,0.5)",
  cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.06)", cardBorderHover: "rgba(255,255,255,0.1)",
  cellBg: "rgba(255,255,255,0.04)", cellBorder: "rgba(255,255,255,0.04)",
  pillBg: "rgba(255,255,255,0.03)", pillBorder: "rgba(255,255,255,0.1)",
  scrollThumb: "rgba(232,71,95,0.3)", scrollThumbHover: "rgba(232,71,95,0.5)",
  fadeBottom: "rgba(18,16,31,0.95)",
  types: {
    social: { label: "Social", color: "#E8475F", bg: "rgba(232,71,95,0.12)", glowWeak: "rgba(232,71,95,0.4)", glowStrong: "rgba(232,71,95,0.7)" },
    "class": { label: "Class", color: "#2D9CDB", bg: "rgba(45,156,219,0.12)", glowWeak: "rgba(45,156,219,0.4)", glowStrong: "rgba(45,156,219,0.7)" },
    festival: { label: "Weekender / Festival", color: "#F2994A", bg: "rgba(242,153,74,0.12)", glowWeak: "rgba(242,153,74,0.4)", glowStrong: "rgba(242,153,74,0.7)" },
  },
};

var OCEAN_TEAL = {
  name: "ocean-teal",
  bg: "linear-gradient(160deg, #040d14 0%, #081820 40%, #0a1a1f 100%)",
  ambientTop: "rgba(0,210,180,0.08)", ambientBottom: "rgba(108,142,239,0.06)",
  titleGradient: "linear-gradient(135deg, #fff 0%, #a0e8d8 100%)",
  textPrimary: "#d0ebe6", textMuted: "rgba(200,230,225,0.5)", textFaint: "rgba(200,230,225,0.4)",
  textGhost: "rgba(200,230,225,0.25)", textSubtle: "rgba(200,230,225,0.35)",
  textDim: "rgba(200,230,225,0.3)", textVeryDim: "rgba(200,230,225,0.2)",
  textLabel: "rgba(200,230,225,0.45)", textLegend: "rgba(200,230,225,0.6)",
  accent: "#00D2B4", accentBg: "rgba(0,210,180,0.15)", accentBorder: "rgba(0,210,180,0.25)",
  accentFaint: "rgba(0,210,180,0.06)", accentMedium: "rgba(0,210,180,0.3)", accentStrong: "rgba(0,210,180,0.5)",
  cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.06)", cardBorderHover: "rgba(255,255,255,0.1)",
  cellBg: "rgba(255,255,255,0.04)", cellBorder: "rgba(255,255,255,0.04)",
  pillBg: "rgba(255,255,255,0.03)", pillBorder: "rgba(255,255,255,0.1)",
  scrollThumb: "rgba(0,210,180,0.3)", scrollThumbHover: "rgba(0,210,180,0.5)",
  fadeBottom: "rgba(8,24,32,0.95)",
  types: {
    social: { label: "Social", color: "#00D2B4", bg: "rgba(0,210,180,0.12)", glowWeak: "rgba(0,210,180,0.4)", glowStrong: "rgba(0,210,180,0.7)" },
    "class": { label: "Class", color: "#6C8EEF", bg: "rgba(108,142,239,0.12)", glowWeak: "rgba(108,142,239,0.4)", glowStrong: "rgba(108,142,239,0.7)" },
    festival: { label: "Weekender / Festival", color: "#FFB347", bg: "rgba(255,179,71,0.12)", glowWeak: "rgba(255,179,71,0.4)", glowStrong: "rgba(255,179,71,0.7)" },
  },
};

function getTheme() {
  var now = new Date();
  var startOfYear = new Date(now.getFullYear(), 0, 1);
  var weekNumber = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
  return weekNumber % 2 === 0 ? MIDNIGHT_ROSE : OCEAN_TEAL;
}

var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var DAYS_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getMonthData(year, month) {
  return { firstDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month + 1, 0).getDate() };
}

function dateKey(y, m, d) {
  return y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
}

function getTodayStr() {
  var now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function isToday(y, m, d) {
  var now = new Date();
  return now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
}

function EventCard(props) {
  var event = props.event, theme = props.theme;
  var cfg = theme.types[event.type];
  var hasLink = !!event.url;
  var inner = (
    <div style={{ padding: "14px 16px", borderRadius: "12px", background: cfg.bg, borderLeft: "3px solid " + cfg.color, cursor: hasLink ? "pointer" : "default", transition: "all 0.2s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: cfg.color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>{cfg.label}</div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: theme.textPrimary }}>{event.name}</div>
        </div>
        {hasLink && <div style={{ fontSize: "11px", color: cfg.color, opacity: 0.7, marginLeft: "10px", marginTop: "2px", flexShrink: 0 }}>{"↗"}</div>}
      </div>
    </div>
  );
  if (hasLink) return <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>{inner}</a>;
  return inner;
}

function UpcomingCard(props) {
  var event = props.event, onClick = props.onClick, isEventToday = props.isEventToday, theme = props.theme;
  var cfg = theme.types[event.type];
  var d = new Date(event.date + "T12:00:00");
  var hasLink = !!event.url;
  return (
    <div onClick={onClick} style={{ padding: "14px 16px", borderRadius: "14px", background: isEventToday ? theme.accent + "0A" : theme.cardBg, border: "1px solid " + (isEventToday ? theme.accent + "26" : theme.cardBorder), cursor: "pointer", transition: "all 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
          <span style={{ fontSize: "10px", fontWeight: 600, color: theme.textFaint, letterSpacing: "1px", textTransform: "uppercase" }}>{d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
          {isEventToday && <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: theme.accent, background: theme.accentBg, padding: "2px 8px", borderRadius: "100px" }}>Today</span>}
        </div>
        {hasLink && <a href={event.url} target="_blank" rel="noopener noreferrer" onClick={function(e){e.stopPropagation()}} style={{ fontSize: "10px", color: cfg.color, opacity: 0.6, textDecoration: "none", padding: "2px 6px", borderRadius: "4px", border: "1px solid " + cfg.color + "33" }}>{"Details ↗"}</a>}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 500, color: theme.textPrimary, lineHeight: 1.4, paddingLeft: "15px" }}>{event.name}</div>
    </div>
  );
}

export default function CalendarApp(props) {
  var events = props.events, usedFallback = props.usedFallback || false;
  var _theme = useState(MIDNIGHT_ROSE), theme = _theme[0], setTheme = _theme[1];
  useEffect(function() { setTheme(getTheme()); }, []);

  var now = new Date();
  var todayStr = getTodayStr();
  var _month = useState(now.getMonth()), currentMonth = _month[0], setCurrentMonth = _month[1];
  var _year = useState(now.getFullYear()), currentYear = _year[0], setCurrentYear = _year[1];
  var _sel = useState(null), selectedDate = _sel[0], setSelectedDate = _sel[1];
  var _filter = useState("all"), filter = _filter[0], setFilter = _filter[1];
  var _calH = useState(null), calendarHeight = _calH[0], setCalendarHeight = _calH[1];

  var eventMap = useMemo(function() {
    var map = {};
    events.forEach(function(e) { if (!map[e.date]) map[e.date] = []; map[e.date].push(e); });
    return map;
  }, [events]);

  var md = getMonthData(currentYear, currentMonth);
  var firstDay = md.firstDay, daysInMonth = md.daysInMonth;

  var filteredEvents = useMemo(function() {
    if (!selectedDate) return [];
    var evts = eventMap[selectedDate] || [];
    if (filter === "all") return evts;
    return evts.filter(function(e) { return e.type === filter; });
  }, [selectedDate, eventMap, filter]);

  var upcomingEvents = useMemo(function() {
    return events.filter(function(e) { return e.date >= todayStr && (filter === "all" || e.type === filter); })
      .sort(function(a,b) { return a.date.localeCompare(b.date); }).slice(0, 15);
  }, [events, filter, todayStr]);

  function navigate(dir) {
    var m = currentMonth + dir, y = currentYear;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setCurrentMonth(m); setCurrentYear(y); setSelectedDate(null);
  }

  function goToToday() {
    setCurrentMonth(now.getMonth()); setCurrentYear(now.getFullYear());
    setSelectedDate(dateKey(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  var calendarDays = [];
  var i; for (i = 0; i < firstDay; i++) calendarDays.push(null);
  var d; for (d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  function calendarRef(el) { if (el && el.offsetHeight !== calendarHeight) setCalendarHeight(el.offsetHeight); }

  var T = theme.types;

  var dynamicCSS =
    "@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } " +
    "button:hover { filter: brightness(1.15); } " +
    ".events-scroll { scrollbar-width: thin; scrollbar-color: " + theme.scrollThumb + " transparent; } " +
    ".events-scroll::-webkit-scrollbar { width: 4px; } " +
    ".events-scroll::-webkit-scrollbar-track { background: transparent; } " +
    ".events-scroll::-webkit-scrollbar-thumb { background: " + theme.scrollThumb + "; border-radius: 4px; } " +
    ".events-scroll::-webkit-scrollbar-thumb:hover { background: " + theme.scrollThumbHover + "; } " +
    "@media (max-width: 900px) { .main-grid { grid-template-columns: 1fr !important; } }";

  useEffect(function() {
    var el = document.getElementById("dmvzouk-css");
    if (!el) { el = document.createElement("style"); el.id = "dmvzouk-css"; document.head.appendChild(el); }
    el.textContent = dynamicCSS;
  }, [dynamicCSS]);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: 0, overflow: "auto" }}>
      <div style={{ position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle, " + theme.ambientTop + " 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", left: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, " + theme.ambientBottom + " 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: "100px", background: theme.accentBg, border: "1px solid " + theme.accentBorder, fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: theme.accent, marginBottom: "20px" }}>DC Metro Area</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.1, background: theme.titleGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Brazilian Zouk</h1>
          <p style={{ fontSize: "15px", color: theme.textMuted, fontWeight: 300, letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>Calendar of Events</p>
          <p style={{ fontSize: "11px", color: theme.textGhost, marginTop: "12px", fontStyle: "italic" }}>{usedFallback ? "Showing cached events" : "Auto-synced from the community Google Sheet"}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "36px", flexWrap: "wrap" }}>
          {[{ key: "all", label: "All Events", color: theme.textPrimary }].concat(Object.keys(T).map(function(k) { return { key: k, label: T[k].label, color: T[k].color }; })).map(function(f) {
            return (
              <button key={f.key} onClick={function(){setFilter(f.key)}} style={{ padding: "8px 20px", borderRadius: "100px", border: "1px solid", borderColor: filter === f.key ? f.color : theme.pillBorder, background: filter === f.key ? f.color + "22" : theme.pillBg, color: filter === f.key ? f.color : theme.textMuted, fontSize: "13px", fontWeight: 500, transition: "all 0.25s ease" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: f.key === "all" ? "linear-gradient(135deg, " + T.social.color + ", " + T["class"].color + ", " + T.festival.color + ")" : f.color, marginRight: "8px", verticalAlign: "middle" }} />
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }}>
          <div ref={calendarRef} style={{ background: theme.cardBg, borderRadius: "16px", border: "1px solid " + theme.cardBorder, padding: "20px", backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <button onClick={function(){navigate(-1)}} style={{ width: "32px", height: "32px", borderRadius: "10px", border: "1px solid " + theme.cardBorderHover, background: theme.cellBg, color: theme.textPrimary, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{"←"}</button>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, margin: 0 }}>{MONTHS[currentMonth] + " " + currentYear}</h2>
                <button onClick={goToToday} style={{ background: "none", border: "none", color: theme.accent, fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px", cursor: "pointer" }}>Today</button>
              </div>
              <button onClick={function(){navigate(1)}} style={{ width: "32px", height: "32px", borderRadius: "10px", border: "1px solid " + theme.cardBorderHover, background: theme.cellBg, color: theme.textPrimary, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{"→"}</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
              {DAYS_LABELS.map(function(dl) { return <div key={dl} style={{ textAlign: "center", fontSize: "10px", fontWeight: 600, color: theme.textSubtle, letterSpacing: "1px", textTransform: "uppercase", padding: "6px 0" }}>{dl}</div>; })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
              {calendarDays.map(function(day, idx) {
                if (!day) return <div key={"empty-" + idx} />;
                var dk = dateKey(currentYear, currentMonth, day);
                var dayEvents = (eventMap[dk] || []).filter(function(e) { return filter === "all" || e.type === filter; });
                var hasEvents = dayEvents.length > 0;
                var isSelected = selectedDate === dk;
                var today = isToday(currentYear, currentMonth, day);
                var types = [];
                dayEvents.forEach(function(e) { if (types.indexOf(e.type) === -1) types.push(e.type); });
                return (
                  <button key={day} onClick={function(){setSelectedDate(isSelected ? null : dk)}} style={{ aspectRatio: "1", borderRadius: "10px", border: "1px solid", borderColor: isSelected ? theme.accentStrong : today ? theme.accentMedium : theme.cellBorder, background: isSelected ? theme.accentBg : today ? theme.accentFaint : hasEvents ? theme.cellBg : "transparent", color: isSelected || today ? "#fff" : hasEvents ? theme.textPrimary : theme.textFaint, fontSize: "12px", fontWeight: today || isSelected ? 700 : 400, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", transition: "all 0.2s ease", position: "relative", padding: "3px", fontFamily: "inherit" }}>
                    {today && <div style={{ position: "absolute", top: "5px", right: "5px", width: "5px", height: "5px", borderRadius: "50%", background: theme.accent }} />}
                    <span>{day}</span>
                    {hasEvents && <div style={{ display: "flex", gap: "3px" }}>{types.map(function(t) { return <div key={t} style={{ width: "4px", height: "4px", borderRadius: "50%", background: T[t] ? T[t].color : "#fff" }} />; })}</div>}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div style={{ marginTop: "24px", padding: "20px", borderRadius: "16px", background: theme.cardBg, border: "1px solid " + theme.cardBorder, animation: "fadeIn 0.3s ease", display: "flex", gap: "16px", alignItems: "stretch" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 16px", color: theme.textLegend, letterSpacing: "1px", textTransform: "uppercase" }}>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
                  {filteredEvents.length === 0 ? (
                    <p style={{ color: theme.textFaint, fontSize: "14px", margin: 0 }}>{"No events this day" + (filter !== "all" ? " (with current filter)" : "") + "."}</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{filteredEvents.map(function(e, idx) { return <EventCard key={idx} event={e} theme={theme} />; })}</div>
                  )}
                </div>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/dancer.png" alt="" style={{ height: "120px", width: "auto", filter: "drop-shadow(0 0 15px " + theme.accent + "33)", pointerEvents: "none" }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ background: theme.cardBg, borderRadius: "16px", border: "1px solid " + theme.cardBorder, padding: "20px", backdropFilter: "blur(20px)", position: "sticky", top: "20px", height: calendarHeight ? calendarHeight + "px" : "auto", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {events.length === 0 && <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(242,153,74,0.1)", border: "1px solid rgba(242,153,74,0.2)", marginBottom: "20px", fontSize: "13px", color: "#F2994A", lineHeight: 1.5, flexShrink: 0 }}>{"Could not load events. Using cached data."}</div>}
            <h3 style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: theme.textLabel, margin: "0 0 20px", flexShrink: 0 }}>Upcoming Events</h3>
            <div className="events-scroll" style={{ flex: 1, overflowY: "auto", paddingRight: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {upcomingEvents.length === 0 ? (
                <p style={{ color: theme.textDim, fontSize: "13px" }}>No upcoming events with this filter.</p>
              ) : upcomingEvents.map(function(e, idx) {
                var dd = new Date(e.date + "T12:00:00");
                var iet = e.date === todayStr;
                return <UpcomingCard key={idx} event={e} isEventToday={iet} theme={theme} onClick={function() { setCurrentMonth(dd.getMonth()); setCurrentYear(dd.getFullYear()); setSelectedDate(e.date); }} />;
              })}
              <div style={{ height: "40px", flexShrink: 0 }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, " + theme.fadeBottom + " 0%, transparent 100%)", borderRadius: "0 0 20px 20px", pointerEvents: "none" }} />
          </div>
        </div>

        <div style={{ borderTop: "1px solid " + theme.cardBorder, padding: "40px 0 32px", textAlign: "center", marginTop: "60px" }}>
          <div style={{ marginBottom: "20px" }}>
            <a href="https://docs.google.com/spreadsheets/d/1YHB3_Qgpo4lu7fCcDGJ5JwF-NBKxbqX2YjcxSTZa5EE/edit?pli=1&gid=559538023#gid=559538023" target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: theme.textSubtle }}>{"📊 View source spreadsheet →"}</a>
          </div>
          <p style={{ fontSize: "14px", color: theme.textLabel, lineHeight: 1.6, fontStyle: "italic", margin: "0 0 20px" }}>DMV Zouk Calendar exists to support and connect our local dance community.</p>
          <div style={{ width: "40px", height: "1px", background: theme.accentMedium, margin: "0 auto 20px" }} />
          <p style={{ fontSize: "12px", color: theme.textDim, letterSpacing: "0.5px" }}>{"Website built with care by "}<a href="https://www.facebook.com/profile.php?id=61588535387670" target="_blank" rel="noopener noreferrer" style={{ color: theme.textMuted, fontWeight: 600 }}>Heart.Bound.Coders</a></p>
          <p style={{ marginTop: "12px", fontSize: "11px", color: theme.textVeryDim, letterSpacing: "1px" }}>{"© 2026 DMV Zouk Community"}</p>
        </div>
      </div>
    </div>
  );
}
