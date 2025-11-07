import bcrypt from 'bcrypt';
import { generateAuthToken as jwtGenerateAuthToken, decodeAuthToken as jwtDecodeAuthToken } from './token-generator';

export async function generateHashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateAuthToken(id: string): string {
  return jwtGenerateAuthToken(id);
}

export function decodeAuthToken(token: string): any {
  return jwtDecodeAuthToken(token);
}
