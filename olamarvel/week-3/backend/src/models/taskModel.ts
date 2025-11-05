import {Schema,model} from "mongoose";


const TaskSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, maxlength: 150, required: true },
  description: { type: String, maxlength: 2000 },
}, { timestamps: true });

const Task = model("Task", TaskSchema);
export default Task