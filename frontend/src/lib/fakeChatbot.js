export function fakeChatbotReply(userMessage) {
  const m = (userMessage ?? "").trim().toLowerCase();
  if (!m) return "Send a message to get a response.";

  if (m.includes("fitness")) return "Prototype reply: Try a simple plan—log workouts consistently and review your history.";
  if (m.includes("budget") || m.includes("expense"))
    return "Prototype reply: Track expenses regularly; review totals and remaining balance in your budget.";
  if (m.includes("plan") || m.includes("schedule") || m.includes("calendar"))
    return "Prototype reply: Add events with clear titles; avoid past-dated entries and keep details optional.";

  return "Prototype reply: I can help with productivity, fitness questions, or planning (stubbed response).";
}
