const {Schema, model } = require('mongoose')

const commentSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: "User", required: true},
    postId: {type: Schema.Types.ObjectId, ref: "Post", required: true},
    comment: {type: String, required: true},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}]
}, {timestamps: true})

module.exports = model("Comment", commentSchema)