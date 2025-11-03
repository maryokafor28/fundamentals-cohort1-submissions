import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from "helmet"
import authRoutes from './routes/auth';
import taskRoutes from "./routes/task";
import { MONGO_URI, PORT } from './config';
import cookieParser from "cookie-parser"


const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);


app.get("/", (_, res) => res.send('API running ') );
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes)

mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}).catch((err) => {
    console.error("Failed to connect to MongoDB: ", err.message)
})

