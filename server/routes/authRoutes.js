const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/protected', authController.authenticateSession, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
