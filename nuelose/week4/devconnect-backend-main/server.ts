import app from "./api/index.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running locally on http://localhost:${PORT}`);
});
