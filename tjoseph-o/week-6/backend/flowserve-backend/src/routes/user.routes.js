const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const { createUserSchema, updateUserSchema, loginSchema } = require('../validations/user.validation');


router.post('/register', validate(createUserSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);


router.use(protect);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;