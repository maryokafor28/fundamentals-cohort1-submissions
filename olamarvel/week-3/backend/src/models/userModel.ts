import mongoose, { Schema, Document } from "mongoose";

interface RefreshToken {
  tokenId: string;
  createdAt: Date;
  revoked: boolean;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: string;
  failedLogins: number;
  lockedUntil: Date | null; 
  refreshTokens: RefreshToken[];
}

const RefreshTokenSchema = new Schema<RefreshToken>({
  tokenId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },
  failedLogins: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null }, 
  refreshTokens: [RefreshTokenSchema]
},{ optimisticConcurrency: false });

const User = mongoose.model<IUser>("User", UserSchema);

export default User
