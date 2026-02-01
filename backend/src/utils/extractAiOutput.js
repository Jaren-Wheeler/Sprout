
// -----------------------------
// Helper: extract AI output
// -----------------------------
function extractAiOutput(response) {
  const item = response.output?.[0]?.content?.[0];
  if (!item) return "";

  if (item.type === "output_text") {
    return item.text;
  }

  if (item.type === "output_json") {
    return JSON.stringify(item.json);
  }

  return "";
};

module.exports = {
    extractAiOutput
}