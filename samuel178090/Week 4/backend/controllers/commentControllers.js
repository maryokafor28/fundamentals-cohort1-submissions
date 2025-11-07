const HttpError = require("../models/errorModel")
const commentModel = require("../models/commentModel")
const postModel = require("../models/postModel")
const userModel = require("../models/userModel")

//===============================CREATE COMMENT 
//POST : api/comments/:postId
// PROTECTED
const createComment = async (req, res, next) => {
    try {
       const {postId} = req.params;
       const {comment} = req.body;
       
       if(!comment?.trim()) {
        return next(new HttpError("Comment is required", 422))
       }
       
       // Check if post exists
       const post = await postModel.findById(postId);
       if(!post) {
           return next(new HttpError("Post not found", 404))
       }
       
       const newComment = await commentModel.create({
           creator: req.user.id,
           comment: comment.trim(), 
           postId,
           likes: []
       });
       
       await postModel.findByIdAndUpdate(postId, {$push: {comments: newComment._id}});
       
       const populatedComment = await commentModel.findById(newComment._id)
           .populate('creator', 'fullName profilePhoto');
           
       res.status(201).json(populatedComment);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to create comment", 500))
    }
}

//===============================GET COMMENTS 
//GET : api/comments/:postId
// PROTECTED
const getPostComments = async (req, res, next) => {
    try {
        const {postId} = req.params;
        const comments = await commentModel.find({postId})
            .populate('creator', 'fullName profilePhoto')
            .sort({createdAt: -1});
        res.json(comments);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to get comments", 500))
    }
} 

//===============================DELETE COMMENT 
//DELETE : api/comments/:commentId
// PROTECTED
const deleteComment = async (req, res, next) => {
    try {
        const {commentId} = req.params;
        const comment = await commentModel.findById(commentId);
        
        if(!comment) {
            return next(new HttpError("Comment not found", 404))
        }
        
        if(comment.creator.toString() !== req.user.id) {
            return next(new HttpError("Not authorized to delete this comment", 403))
        }
        
        await postModel.findByIdAndUpdate(comment.postId, {$pull: {comments: commentId}});
        await commentModel.findByIdAndDelete(commentId);
        
        res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        return next(new HttpError(error.message || "Failed to delete comment", 500))
    }
}

//===============================LIKE/UNLIKE COMMENT 
//POST : api/comments/:commentId/like
// PROTECTED
const likeComment = async (req, res, next) => {
    try {
        const {commentId} = req.params;
        const comment = await commentModel.findById(commentId);
        
        if(!comment) {
            return next(new HttpError("Comment not found", 404))
        }
        
        const isLiked = comment.likes.includes(req.user.id);
        let updatedComment;
        
        if(isLiked) {
            updatedComment = await commentModel.findByIdAndUpdate(
                commentId,
                {$pull: {likes: req.user.id}},
                {new: true}
            ).populate('creator', 'fullName profilePhoto');
        } else {
            updatedComment = await commentModel.findByIdAndUpdate(
                commentId,
                {$push: {likes: req.user.id}},
                {new: true}
            ).populate('creator', 'fullName profilePhoto');
        }
        
        res.json(updatedComment);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to like comment", 500))
    }
} 

module.exports = {createComment, getPostComments, deleteComment, likeComment}