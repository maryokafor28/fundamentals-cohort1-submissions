import express from "express";
import routes from "./routes/index";

const app = express();

app.use(express.json());

// base route for testing
app.get("/", (req, res) => {
  res.json({ message: "API working ✅" });
});

// attach all routes
app.use("/api", routes);

export default app;
