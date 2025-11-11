import mongoose, { Document, Schema } from "mongoose";

export interface IBlacklistedToken extends Document {
  token: string;
  blacklistedAt: Date;
}

const tokenBlacklistSchema = new Schema<IBlacklistedToken>({
  token: { type: String, required: true, unique: true },
  blacklistedAt: { type: Date, default: Date.now },
});

export const TokenBlacklist = mongoose.model<IBlacklistedToken>(
  "TokenBlacklist",
  tokenBlacklistSchema
);
