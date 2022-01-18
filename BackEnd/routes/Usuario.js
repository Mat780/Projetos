const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(cors());

const UserController = require('../controllers/UserController');

router.post('/login', UserController.login);
router.post('/user', UserController.createUser);


module.exports = router;