const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();
const validateCommentInput = require('../middlewares/validateCommentInput'); 

// Create a new comment
/**
 * @swagger
 * /community/comments:
 *   post:
 *     summary: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *               username:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment_id:
 *                   type: integer
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/comments', validateCommentInput, async (req, res) => {
    const { post_id, username, content } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Comments (post_id, username, content) VALUES (?, ?, ?)',
            [post_id, username, content]
        );
        res.status(201).json({ comment_id: result.insertId });
    } catch (err) {
        console.error('Error during POST request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all comments for a specific post
/**
 * @swagger
 * /community/comments/{post_id}:
 *   get:
 *     summary: Retrieve comments for a specific post
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A list of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   comment_id:
 *                     type: integer
 *                   post_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Post not found
 */
router.get('/comments/:post_id', async (req, res) => {
    const { post_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Comments WHERE post_id = ?', [post_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Comments not found for this post' });
        }
        res.json(rows);
    } catch (err) {
        console.error('Error during GET request:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
