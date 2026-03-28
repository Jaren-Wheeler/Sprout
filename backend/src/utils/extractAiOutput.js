
function stringifyJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

// -----------------------------
// Helper: extract AI output
// -----------------------------
function extractAiOutput(response) {
  const outputs = Array.isArray(response?.output) ? response.output : [];
  const parts = [];

  for (const output of outputs) {
    const content = Array.isArray(output?.content) ? output.content : [];

    for (const item of content) {
      if (item?.type === "output_text" && typeof item.text === "string") {
        parts.push(item.text);
        continue;
      }

      if (item?.type === "output_json" && item.json !== undefined) {
        parts.push(stringifyJson(item.json));
      }
    }
  }

  return parts.filter(Boolean).join("\n").trim();
}

module.exports = {
  extractAiOutput
};
