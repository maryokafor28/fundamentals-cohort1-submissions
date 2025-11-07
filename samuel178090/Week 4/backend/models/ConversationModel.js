const {Schema, model} = require("mongoose")

const conversationSchema = new Schema({
    participants: [{type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
        text: {type: String, required: true},
        senderId: {type: Schema.Types.ObjectId, ref: "User"}
        
    }
}, { timestamps: true })

module.exports = model("Conversation", conversationSchema)