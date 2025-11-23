const express = require('express');
const router = express.Router();
const controller = require('./orders.controller');
const {authenticate} = require('../auth/auth.middleware');

router.post('/', authenticate, controller.create);
router.get('/:id', authenticate, controller.getOrder);

module.exports = router;