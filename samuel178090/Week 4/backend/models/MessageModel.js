const {Schema, model} = require("mongoose")


const messageSchema = new Schema({
    conversationId: {type: Schema.Types.ObjectId, ref: "Conversation", required: true},
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    messageBody: {type: String, required: true},
}, {timestamps: true})


module.exports = model("Message", messageSchema);
