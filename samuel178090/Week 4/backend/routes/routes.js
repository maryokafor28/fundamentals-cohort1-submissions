

const express = require('express'); // Add this (router() is a method of express)
const router = express.Router();

const { registerUser, loginUser, logoutUser, getUser, getUsers, editUser, followUnfollowUser,
  changeUserAvatar } = require('../controllers/userControllers');
const {createPost, updatePost, deletePost, getFollowingPosts, likeDislikePost,
 getUserPosts, createBookmark, getUserBookmarks , getPost, getPosts} = require('../controllers/postControllers')

const {createComment, getPostComments, deleteComment, likeComment} = require('../controllers/commentControllers')
const {createMessage, getMessages, getConversations} = require('../controllers/messageControllers')
const authMiddleware = require('../middleware/authMiddleware') // Add this import




// USER ROUTES
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.post('/users/logout', authMiddleware, logoutUser);
router.get('/users/bookmarks', authMiddleware, getUserBookmarks);
router.get('/users/:id', authMiddleware, getUser);
router.get('/users', authMiddleware, getUsers);
router.patch('/users/edit', authMiddleware, editUser);
router.post('/users/:id/follow', authMiddleware, followUnfollowUser);
router.post('/users/avatar', authMiddleware, changeUserAvatar);
router.get('/users/:id/posts', authMiddleware, getUserPosts);



//POST ROUTES
router.post('/posts', authMiddleware, createPost);
router.get('/posts/following', authMiddleware, getFollowingPosts);
router.get('/posts', authMiddleware, getPosts);
router.get('/posts/:id', authMiddleware, getPost);
router.patch('/posts/:id', authMiddleware, updatePost);
router.delete('/posts/:id', authMiddleware, deletePost);
router.post('/posts/:id/like', authMiddleware, likeDislikePost);
router.post('/posts/:id/bookmark', authMiddleware, createBookmark);

//COMMENT ROUTES
router.post('/comments/:postId', authMiddleware, createComment);
router.get('/comments/:postId', authMiddleware, getPostComments);
router.delete('/comments/:commentId', authMiddleware, deleteComment);
router.post('/comments/:commentId/like', authMiddleware, likeComment);


//MESSAGE ROUTES
router.post('/messages/:receiverId', authMiddleware, createMessage);
router.get('/messages/:receiverId', authMiddleware, getMessages);
router.get('/conversations', authMiddleware, getConversations);

module.exports = router;