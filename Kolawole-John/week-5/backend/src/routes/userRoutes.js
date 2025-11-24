const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Route: /api/users
router.route('/')
  .get(getAllUsers)     // GET all users
  .post(createUser);    // CREATE new user

// Route: /api/users/:id
router.route('/:id')
  .get(getUserById)     // GET user by ID
  .put(updateUser)      // UPDATE user
  .delete(deleteUser);  // DELETE user

module.exports = router;