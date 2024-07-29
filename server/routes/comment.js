const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();
const validateCommentInput = require('../middlewares/validateCommentInput'); 

// Create a new comment
/**
 * @swagger
 * /community/comments:
 *   post:
 *     tags:
 *      - comments
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
        res.status(201).json({ comment_id: result.insertId, username, content });
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
 *     tags:
 *      - comments
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
    const post_id = parseInt(req.params.post_id,10); //문자열을 숫자로 변환
    if(isNaN(post_id)){
        return res.status(400).json({error: 'Invalid post ID'});
    }
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

// Update a comment
/**
 * @swagger
 * /community/comments/{comment_id}:
 *   patch:
 *     tags:
 *      - comments
 *     summary: Update a comment
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment_id:
 *                   type: integer
 *                 content:
 *                   type: string
 *       400:
 *         description: Bad Request - Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.patch('/comments/:comment_id', async (req, res) => {
    const comment_id = parseInt(req.params.comment_id, 10);
    const { content } = req.body;
    if (isNaN(comment_id) || !content) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    try {
        const [result] = await db.query(
            'UPDATE Comments SET content = ? WHERE comment_id = ?',
            [content, comment_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json({ comment_id, content });
    } catch (err) {
        console.error('Error during PATCH request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment
/**
 * @swagger
 * /community/comments/{comment_id}:
 *   delete:
 *     tags:
 *      - comments
 *     summary: Delete a comment
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to delete
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/comments/:comment_id', async (req, res) => {
    const comment_id = parseInt(req.params.comment_id, 10);
    if (isNaN(comment_id)) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    try {
        const [result] = await db.query(
            'DELETE FROM Comments WHERE comment_id = ?',
            [comment_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(204).send(); // No content
    } catch (err) {
        console.error('Error during DELETE request:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
