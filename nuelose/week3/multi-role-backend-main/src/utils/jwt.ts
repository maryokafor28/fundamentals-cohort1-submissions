import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config.js'

export const createAccessToken = (userId: string) =>
  jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

export const createRefreshToken = (userId: string) =>
  jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string ) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
