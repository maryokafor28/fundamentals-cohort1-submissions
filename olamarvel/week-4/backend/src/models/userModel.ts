import mongoose, { Schema, Document, Types } from "mongoose";

interface RefreshToken {
  tokenId: string;
  createdAt: Date;
  revoked: boolean;
}

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  role: string;
  bio?: string;
  profilePicture?: string;
  projects: Types.ObjectId[];
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
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  failedLogins: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null }, 
  refreshTokens: [RefreshTokenSchema]
},{ optimisticConcurrency: false });

const User = mongoose.model<IUser>("User", UserSchema);

export default User