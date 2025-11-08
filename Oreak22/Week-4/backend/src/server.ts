import app from "./app.js";
const PORT = process.env.PORT || 4000;
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
