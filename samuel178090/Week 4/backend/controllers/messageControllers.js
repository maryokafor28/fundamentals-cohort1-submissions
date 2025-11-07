const HttpError = require("../models/errorModel")
const ConversationModel = require("../models/ConversationModel")
const MessageModel = require("../models/MessageModel");
const { getReceiverSocketId, io } = require("../socket/socket");



//======================== CREATE MESSAGE
//POST : api/messages/:receiverId
// PROTECTED
const createMessage = async (req, res, next) => {
    try {
        const {receiverId} = req.params;
        const {messageBody} = req.body;
        //check if there's already a conversation between current user and receiver
        // Validate receiverId
        if (!receiverId || receiverId === req.user.id) {
            return next(new HttpError("Invalid receiver ID", 422));
        }
        
        // Sanitize message body
        const sanitizedMessage = messageBody.trim();
        if (!sanitizedMessage || sanitizedMessage.length > 1000) {
            return next(new HttpError("Message must be 1-1000 characters", 422));
        }
        
        let conversation = await ConversationModel.findOne({
            participants: { $all: [req.user.id, receiverId] }
        });
        
        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [req.user.id, receiverId], 
                lastMessage: { text: sanitizedMessage, senderId: req.user.id }
            });
        }
        // create a new message
        const newMessage = await MessageModel.create({
            conversationId: conversation._id, 
            sender: req.user.id, 
            messageBody: sanitizedMessage
        });
        
        await conversation.updateOne({
            lastMessage: { text: sanitizedMessage, senderId: req.user.id }
        });

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json(newMessage)
    } catch (error) {
        return next(new HttpError(error))
    }
}




//======================== GET MESSAGES 
//GET : api/messages/:receiverId
// PROTECTED
const getMessages = async (req, res, next) => {
    try {
        const {receiverId} = req.params;
        const conversation = await ConversationModel.findOne({participants: {$all: [req.user.id,
             receiverId]}})
   if(!conversation) {
       return next(new HttpError("No conversation found with this peason", 404))
   }
   const messages = await MessageModel.find({conversationId: conversation._id}).sort({createdAt: 1})
   res.json(messages)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//======================== GET CONVERSATIONS
//GET : api/conversations
// PROTECTED
const getConversations = async (req, res, next) => {
    try {
       let conversations = await ConversationModel.find({participants: req.user.id}).
       populate({path: "participants", select: "fullName profilePhoto"}).sort({createdAt: -1});
       // remove logged in user from participants array
       conversations.forEach((conversation) => {
        conversation.participants = conversation.participants.filter(
            (participant) => participant._id.toString() !== req.user.id.toString());
       });
       res.json(conversations)
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {createMessage, getMessages, getConversations}
