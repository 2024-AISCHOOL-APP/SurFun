const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cacheMiddleware =require('../middlewares/cacheMiddleware');
const passport = require('passport');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "your_password"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "123-456-7890"
 *               preference:
 *                 type: string
 *                 example: "tech_blog"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username, password, and phone number are required
 *       500:
 *         description: Error registering user
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "your_password"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Access protected route
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized
 */
router.get('/protected', authController.authenticateSession, (req, res) => {
    res.send('This is a protected route');
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect to Google for authentication
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth 2.0 login page
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect on successful login
 *       401:
 *         description: Unauthorized
 */

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);


module.exports = router;
