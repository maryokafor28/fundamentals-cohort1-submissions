import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

// import csrf from "@dr.pogodin/csurf";
import cookieParser from "cookie-parser";

dotenv.config();

export const securityMiddleware = (app) => {
  app.use(helmet());

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
  console.log(allowedOrigins);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`Blocked by CORS: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    })
  );

  app.use(cookieParser());

  // const csrfProtection = csrf({ cookie: true });
};
