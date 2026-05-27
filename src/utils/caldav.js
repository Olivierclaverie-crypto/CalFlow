// ── CalDAV helpers ────────────────────────────────────────────────────────────

export async function caldavRequest(method, path, auth, body = "", extraHeaders = {}) {
  const res = await fetch(`/api/caldav?path=${encodeURIComponent(path)}`, {
    method,
    headers: {
      "Authorization": auth,
      "Content-Type": "application/xml; charset=utf-8",
      ...extraHeaders,
    },
    body: method === "GET" || method === "HEAD" ? undefined : body,
  });
  const text = await res.text();
  return { status: res.status, text };
}

export function parseCalendars(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const responses = doc.querySelectorAll("response");
  const cals = [];
  responses.forEach(r => {
    const href = r.querySelector("href")?.textContent || "";
    const displayName = r.querySelector("displayname")?.textContent
      || href.split("/").filter(Boolean).pop() || "Sans nom";
    const color = r.querySelector("calendar-color")?.textContent || "#2B5A9E";
    const isCalendar = r.querySelector("resourcetype calendar") !== null;
    if (isCalendar && href) {
      cals.push({ href, displayName, color: color.slice(0, 7) });
    }
  });
  return cals;
}

export function parseEvents(xml, calHref, calColor, calName) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const responses = doc.querySelectorAll("response");
  const events = [];
  responses.forEach(r => {
    const href = r.querySelector("href")?.textContent || "";
    const calData = r.querySelector("calendar-data")?.textContent || "";
    if (!calData) return;
    try {
      const ev = parseICS(calData, href, calHref, calColor, calName);
      if (ev) events.push(ev);
    } catch (e) {}
  });
  return events;
}

export function parseICS(ics, href, calHref, calColor, calName) {
  const lines = ics.replace(/\r\n /g, "").replace(/\r\n/g, "\n").split("\n");
  const get = key => {
    const line = lines.find(l => l.startsWith(key + ":") || l.startsWith(key + ";"));
    if (!line) return null;
    return line.replace(/^[^:]+:/, "").trim();
  };
  const getAll = key => lines
    .filter(l => l.startsWith(key + ":") || l.startsWith(key + ";"))
    .map(l => l.replace(/^[^:]+:/, "").trim());

  const uid     = get("UID");
  const summary = get("SUMMARY") || "(sans titre)";
  const dtstart = get("DTSTART");
  const dtend   = get("DTEND");
  const loc     = get("LOCATION") || "";
  const desc    = get("DESCRIPTION") || "";
  const rrule   = get("RRULE") || "";
  const exdates = getAll("EXDATE").map(s => s.slice(0, 8)).map(s =>
    s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6, 8));

  if (!uid || !dtstart) return null;

  const allDay = dtstart.replace(/;[^:]+/, "").length === 8 || dtstart.includes("VALUE=DATE");
  const parseDate = s => {
    if (!s) return null;
    const clean = s.replace(/;[^:]*:/, "").replace(/Z$/, "");
    if (clean.length === 8) return clean.slice(0, 4) + "-" + clean.slice(4, 6) + "-" + clean.slice(6, 8);
    const y = clean.slice(0, 4), mo = clean.slice(4, 6), d = clean.slice(6, 8);
    const h = clean.slice(9, 11) || "00", mi = clean.slice(11, 13) || "00";
    return { date: `${y}-${mo}-${d}`, time: `${h}:${mi}` };
  };

  const start = parseDate(dtstart);
  const end   = parseDate(dtend);

  return {
    id: uid, href, calHref, calColor, calName,
    title: summary, allDay,
    startDate: allDay ? start : start.date,
    startTime: allDay ? null : start.time,
    endDate:   allDay ? (typeof end === "string" ? end : (end?.date || start)) : end?.date,
    endTime:   allDay ? null : end?.time,
    location: loc,
    notes: desc.replace(/\\n/g, "\n"),
    rrule, exdates,
    status: "confirmed",
    type: "event",
  };
}

export function expandRecurring(ev, rangeStart, rangeEnd) {
  if (!ev.rrule) return [ev];
  const occurrences = [];
  const params = {};
  ev.rrule.split(";").forEach(p => { const [k, v] = p.split("="); params[k] = v; });

  const freq     = params.FREQ;
  const count    = params.COUNT ? parseInt(params.COUNT) : 500;
  const until    = params.UNTIL ? params.UNTIL.slice(0, 8) : null;
  const interval = params.INTERVAL ? parseInt(params.INTERVAL) : 1;
  const byDay    = params.BYDAY ? params.BYDAY.split(",") : null;

  const startD  = new Date(ev.startDate + "T" + (ev.startTime || "00:00") + ":00");
  const endD    = new Date((ev.endDate || ev.startDate) + "T" + (ev.endTime || ev.startTime || "00:00") + ":00");
  const duration = endD - startD;

  let current = new Date(startD);
  let n = 0;
  const toISO = d => d.toISOString().slice(0, 10);
  const toTime = d => d.toTimeString().slice(0, 5);
  const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  while (n < count) {
    const curISO = toISO(current);
    if (until && curISO > until.slice(0, 4) + "-" + until.slice(4, 6) + "-" + until.slice(6, 8)) break;
    if (curISO > rangeEnd) break;

    let matchesDay = true;
    if (byDay && freq === "WEEKLY") {
      const dayCode = DAYS[current.getDay()];
      matchesDay = byDay.some(d => d.includes(dayCode));
    }

    if (matchesDay && curISO >= rangeStart && !ev.exdates?.includes(curISO)) {
      const occEnd = new Date(current.getTime() + duration);
      occurrences.push({
        ...ev,
        id: `${ev.id}_${curISO}`,
        startDate: curISO,
        startTime: ev.allDay ? null : toTime(current),
        endDate: toISO(occEnd),
        endTime: ev.allDay ? null : toTime(occEnd),
        isRecurring: true,
        masterUid: ev.id,
        recurrenceDate: curISO,
      });
      n++;
    }

    const next = new Date(current);
    switch (freq) {
      case "DAILY":   next.setDate(next.getDate() + interval); break;
      case "WEEKLY":
        if (byDay && byDay.length > 1) next.setDate(next.getDate() + 1);
        else next.setDate(next.getDate() + 7 * interval);
        break;
      case "MONTHLY": next.setMonth(next.getMonth() + interval); break;
      case "YEARLY":  next.setFullYear(next.getFullYear() + interval); break;
      default:        next.setDate(next.getDate() + 7);
    }
    current = next;
    if (n > 1000) break;
  }
  return occurrences.length > 0 ? occurrences : [ev];
}
