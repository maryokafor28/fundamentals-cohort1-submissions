import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../services/tokenServices";
import { env } from "../config/env";

describe("Token Service", () => {
  it("should generate a valid JWT containing user id", () => {
    const token = generateAccessToken("user123");
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
      id: string;
    };
    expect(decoded.id).toBe("user123");
  });

  it("should refresh access token after expiry using refresh token", async () => {
    const refreshToken = generateRefreshToken("user123");

    // Short-lived token (expires in 1 second)
    const shortLivedToken = jwt.sign(
      { id: "user123" },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1s",
      }
    );

    // Wait 1.5 seconds for expiry
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Expired token should now return null
    const expiredTokenResult = verifyToken(shortLivedToken);
    expect(expiredTokenResult).toBeNull();

    // Refresh token still valid
    const decodedRefresh = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    ) as {
      id: string;
    };
    expect(decodedRefresh.id).toBe("user123");

    // Generate new access token
    const newAccessToken = generateAccessToken(decodedRefresh.id);
    const decodedNew = jwt.verify(newAccessToken, env.ACCESS_TOKEN_SECRET) as {
      id: string;
    };

    expect(decodedNew.id).toBe("user123");
  });
});
