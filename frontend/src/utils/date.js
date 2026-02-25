import { format } from "date-fns";

export function groupEventsByDate(events) {
  const grouped = {};

  for (const e of events) {
    const key = format(new Date(e.startTime), "yyyy-MM-dd");

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  }

  return grouped;
}

export function getEventColor(id) {
  const colors = [
    "bg-blue-200 border-blue-400",
    "bg-green-200 border-green-400",
    "bg-purple-200 border-purple-400",
    "bg-yellow-200 border-yellow-400",
    "bg-pink-200 border-pink-400"
  ];

  const index = Math.abs(hashCode(id)) % colors.length;
  return colors[index];
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}