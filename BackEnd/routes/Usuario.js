const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors());

const UserController = require('../src/controllers/UserController');
const medAuth = require('../src/middlewares/medAuth');

router.post('/login', UserController.login);
router.post('/user', medAuth , UserController.createUser);

module.exports = router;