import jwt, { JwtPayload } from 'jsonwebtoken';
import appConfig from '../../config/config'; // updated import

export const generateAuthToken = (id: string): string => {
  const secret = appConfig.jwtSecret; // updated usage
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export const decodeAuthToken = (token: string): string | JwtPayload => {
  const secret = appConfig.jwtSecret; // updated usage
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, secret);
};
