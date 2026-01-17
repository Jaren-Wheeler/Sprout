require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
console.log(process.env.OPENAI_API_KEY ? "API key loaded" : "Missing key")
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
