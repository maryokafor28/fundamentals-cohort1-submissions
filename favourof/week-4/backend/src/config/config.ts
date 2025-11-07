import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  port: process.env.PORT || 4001,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUrl: process.env.MONGODB_URL as string,
  accessToken: process.env.ACCESS_TOKEN_SECRET!,
  refreshToken: process.env.REFRESH_TOKEN_SECRET!,
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  frontendOrigin: process.env.FRONTEND_ORIGIN,
  cookieDomain: process.env.COOKIE_DOMAIN,
};
