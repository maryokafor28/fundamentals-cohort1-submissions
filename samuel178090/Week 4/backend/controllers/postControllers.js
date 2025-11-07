const HttpError = require('../models/errorModel');
const PostModel = require('../models/postModel')
const UserModel = require('../models/userModel')

const crypto = require('crypto')
const cloudinary =require('../utils/cloudinary')

// UUID fallback for older Node.js versions
const generateUUID = () => {
    try {
        return crypto.randomUUID()
    } catch (error) {
        // Fallback for Node.js < 14.17
        return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
} 
const fs = require('fs')
const path = require('path')

//=========CREATED POST
//POST : api/posts
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        const {body} = req.body
        console.log('Post creation request:', { body, files: req.files })
        
        if(!body?.trim()) {
            return next(new HttpError("Post content is required", 422))
        }
        
        let imageUrl = null;
        if(req.files && req.files.image) {
            const {image} = req.files;
            console.log('Image file details:', { name: image.name, size: image.size, mimetype: image.mimetype })
            
            // Check file size (5MB limit)
            if(image.size > 5000000) {
                return next(new HttpError("Image size should be less than 5MB", 422))
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
            if(!allowedTypes.includes(image.mimetype)) {
                return next(new HttpError("Please upload a valid image file", 422))
            }
            
            let fileName = image.name.split(".");
            fileName = fileName[0] + generateUUID() + "." + fileName[fileName.length - 1];
            const uploadPath = path.join(__dirname, '..', 'uploads', fileName)
            
            try {
                await image.mv(uploadPath);
                const result = await cloudinary.uploader.upload(uploadPath, {
                    resource_type: "image",
                    folder: "devconnect/posts",
                    transformation: [
                        { width: 800, height: 600, crop: "limit" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                });
                
                if(result.secure_url) {
                    imageUrl = result.secure_url;
                    console.log('Image uploaded successfully:', imageUrl)
                }
                
                // Clean up local file
                fs.unlink(uploadPath, (err) => {
                    if (err) console.log('Failed to delete local file:', err)
                })
                
            } catch (uploadError) {
                console.error('Image upload error:', uploadError)
                // Continue without image instead of failing
                imageUrl = null;
            }
        }
        
        const newPost = await PostModel.create({
            creator: req.user.id, 
            body: body.trim(), 
            image: imageUrl,
            likes: [],
            comments: []
        });
        
        await UserModel.findByIdAndUpdate(req.user.id, {$push: {posts: newPost._id}});
        
        const populatedPost = await PostModel.findById(newPost._id).populate('creator', 'fullName profilePhoto');
        console.log('Post created successfully:', populatedPost)
        
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Post creation error:', error)
        return next(new HttpError(error.message || "Failed to create post", 500))
    }
}





//=========GET POST
//GET : api/posts/:id
// PROTECTED
const getPost = async (req, res, next) => {
    try {
         const {id} = req.params;
         const post = await PostModel.findById(id)
            .populate('creator', 'fullName profilePhoto')
            .populate({
                path: 'comments',
                populate: { path: 'creator', select: 'fullName profilePhoto' },
                options: { sort: { createdAt: -1 } }
            });
         if(!post) {
            return next(new HttpError("Post not found", 404))
         }
         res.json(post)
    } catch (error) {
        return next(new HttpError(error.message || "Failed to get post", 500))
    }
}






//=========GET POSTS
//GET : api/posts
// PROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find()
            .populate('creator', 'fullName profilePhoto')
            .sort({createdAt: -1})
            .limit(50);
        res.json(posts)
    } catch (error) {
        return next(new HttpError(error.message || "Failed to get posts", 500))
    }
}





//=========UPDATE POST
//PATCH : api/posts/:id
// PROTECTED
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const {body} = req.body;
        
        if(!body?.trim()) {
            return next(new HttpError("Post content is required", 422))
        }
        
        const post = await PostModel.findById(postId);
        if(!post) {
            return next(new HttpError("Post not found", 404))
        }
        
        if(post.creator.toString() !== req.user.id.toString()) {
            return next(new HttpError("Not authorized to update this post", 403))
        }
        
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId, 
            {body: body.trim()}, 
            {new: true}
        ).populate('creator', 'fullName profilePhoto');
        
        res.status(200).json(updatedPost);   
    } catch (error) {
        return next(new HttpError(error.message || "Failed to update post", 500))
    }
}







//============DELETE POST
//DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId);
        
        if(!post) {
            return next(new HttpError("Post not found", 404))
        }
        
        if(post.creator.toString() !== req.user.id.toString()) {
            return next(new HttpError("Not authorized to delete this post", 403))
        }
        
        await PostModel.findByIdAndDelete(postId);
        await UserModel.findByIdAndUpdate(post.creator, {$pull: {posts: postId}});
        
        res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        return next(new HttpError(error.message || "Failed to delete post", 500))
    }
}






//============GET FOLLOWING POST
//GET : api/posts/following
// PROTECTED
const getFollowingPosts = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        const followingIds = [...user.following, req.user.id]; // Include own posts
        
        const posts = await PostModel.find({creator: {$in: followingIds}})
            .populate('creator', 'fullName profilePhoto')
            .sort({createdAt: -1})
            .limit(50);
            
        res.json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to get following posts", 500))
    }
}







//=========LIKE/UNLIKE POST
//POST : api/posts/:id/like
// PROTECTED
const likeDislikePost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const post = await PostModel.findById(id);
        
        if(!post) {
            return next(new HttpError("Post not found", 404))
        }
        
        const isLiked = post.likes.includes(req.user.id);
        let updatedPost;
        
        if(isLiked) {
            updatedPost = await PostModel.findByIdAndUpdate(
                id, 
                {$pull: {likes: req.user.id}}, 
                {new: true}
            ).populate('creator', 'fullName profilePhoto');
        } else {
            updatedPost = await PostModel.findByIdAndUpdate(
                id, 
                {$push: {likes: req.user.id}}, 
                {new: true}
            ).populate('creator', 'fullName profilePhoto');
        }
        
        res.json(updatedPost);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to like/unlike post", 500))
    }
}




//=========GET USER POSTS
//GET : api/users/:id/posts
// PROTECTED
const getUserPosts = async (req, res, next) => {
    try {
       const {id: userId} = req.params;
       const posts = await PostModel.find({creator: userId})
           .populate('creator', 'fullName profilePhoto')
           .sort({createdAt: -1});
       res.json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to get user posts", 500))
    }
}







//================ BOOKMARK/UNBOOKMARK POST  
//POST : api/posts/:id/bookmark
// PROTECTED
const createBookmark = async (req, res, next) => {
    try {
       const {id} = req.params;
       
       // Check if post exists
       const post = await PostModel.findById(id);
       if(!post) {
           return next(new HttpError("Post not found", 404))
       }
       
       const user = await UserModel.findById(req.user.id);
       const isBookmarked = user.bookmarks.includes(id);
       
       let updatedUser;
       if(isBookmarked) {
           updatedUser = await UserModel.findByIdAndUpdate(
               req.user.id, 
               {$pull: {bookmarks: id}}, 
               {new: true}
           );
       } else {
           updatedUser = await UserModel.findByIdAndUpdate(
               req.user.id, 
               {$push: {bookmarks: id}}, 
               {new: true}
           );
       }
       
       res.json({
           message: isBookmarked ? "Post removed from bookmarks" : "Post bookmarked",
           bookmarks: updatedUser.bookmarks
       });
    } catch (error) {
        return next(new HttpError(error.message || "Failed to bookmark post", 500))
    }
}







//===============GET BOOKMARKS  
//GET : api/users/bookmarks
// PROTECTED
const getUserBookmarks = async (req, res, next) => {
    try {
       const user = await UserModel.findById(req.user.id)
           .populate({
               path: 'bookmarks',
               populate: { path: 'creator', select: 'fullName profilePhoto' },
               options: { sort: { createdAt: -1 } }
           });
       res.json(user.bookmarks);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to get bookmarks", 500))
    }
}

module.exports = {createPost, updatePost, deletePost, getFollowingPosts, likeDislikePost,
 getUserPosts, createBookmark, getUserBookmarks , getPost, getPosts}
