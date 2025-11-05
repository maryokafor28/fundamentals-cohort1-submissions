import {Schema,model} from "mongoose";


const BlackListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jti: { type: String, required: true },
  expiresAt: Date,
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

const BlackList = model("BlackList", BlackListSchema);
export default BlackList