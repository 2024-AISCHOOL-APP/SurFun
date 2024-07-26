const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();

// Like a post
/**
 * @swagger
 * /community/likes:
 *   post:
 *     summary: Like a community post
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
 *     responses:
 *       201:
 *         description: Like added
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/likes', async (req, res) => {
    const { post_id, username } = req.body;
    try {
        await db.query(
            'INSERT INTO Likes (post_id, username) VALUES (?, ?)',
            [post_id, username]
        );
        res.status(201).json({ message: 'Like added' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'User has already liked this post' });
        }
        console.error('Error during POST request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Unlike a post
/**
 * @swagger
 * /community/likes:
 *   delete:
 *     summary: Unlike a community post
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
 *     responses:
 *       200:
 *         description: Like removed
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal server error
 */
router.delete('/likes', async (req, res) => {
    const { post_id, username } = req.body;
    try {
        const [result] = await db.query(
            'DELETE FROM Likes WHERE post_id = ? AND username = ?',
            [post_id, username]
        );
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Like not found' });
        }
        res.json({ message: 'Like removed' });
    } catch (err) {
        console.error('Error during DELETE request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get likes for a specific post
/**
 * @swagger
 * /community/likes/{post_id}:
 *   get:
 *     summary: Retrieve likes for a specific post
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A list of likes for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   like_id:
 *                     type: integer
 *                   post_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Post not found
 */
router.get('/likes/:post_id', async (req, res) => {
    const { post_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Likes WHERE post_id = ?', [post_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Likes not found for this post' });
        }
        res.json(rows);
    } catch (err) {
        console.error('Error during GET request:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
