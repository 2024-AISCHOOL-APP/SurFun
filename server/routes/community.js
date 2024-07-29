// community.js
const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();
const validatePostInput = require('../middlewares/validatePostInput'); 
const validateCommentInput=require('../middlewares/validateCommentInput');
const upload = require('../middlewares/upload');
const path = require('path');
const commentRouter = require('./comment'); 
const likeRouter = require('./likes');

function formatDateToMySQL(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Create a new post
/**
 * @swagger
 * /community/posts:
 *   post:
 *     tags:
 *      - community
 *     summary: Create a new community post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               post_date:
 *                 type: string
 *                 format: date-time
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The created community post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_id:
 *                   type: integer
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: Bad Request - Username does not exist
 *       500:
 *         description: Internal server error
 */
router.post('/posts', upload.single('image'), validatePostInput, async (req, res) => {
    const { username, title, content, post_date, latitude, longitude } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        const [user] = await db.query('SELECT * FROM User WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Username does not exist' });
        }

        const formattedDate = formatDateToMySQL(post_date);
        const [result] = await db.query(
            'INSERT INTO Community_Post (username, title, content, post_date, latitude, longitude, image, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, title, content, formattedDate, latitude, longitude, image, 0] 
        );
        res.status(201).json({ post_id: result.insertId, imageUrl: `/uploads/${image}` });
    } catch (err) {
        console.error('Error during POST request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all posts
/**
 * @swagger
 * /community/posts:
 *   get:
 *     tags:
 *      - community
 *     summary: Retrieve a list of community posts
 *     responses:
 *       200:
 *         description: A list of community posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   post_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   post_date:
 *                     type: string
 *                     format: date-time
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   image:
 *                     type: string
 *                   views:          
 *                     type: integer
 */
router.get('/posts', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Community_Post');
        res.json(rows);
    } catch (err) {
        console.error('Error during GET request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get a specific post by ID
/**
 * @swagger
 * /community/posts/{id}:
 *   get:
 *     tags:
 *      - community
 *     summary: Retrieve a single community post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A single community post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post_id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 post_date:
 *                   type: string
 *                   format: date-time
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 image:
 *                   type: string
 *                 views:          
 *                   type: integer 
 *       404:
 *         description: Post not found
 */
router.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    console.log('Received post_id:', id);  // ID 값 확인용 로그 추가

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    try {
        await db.query('UPDATE Community_Post SET views = views + 1 WHERE post_id = ?', [id]);

        const [rows] = await db.query('SELECT * FROM Community_Post WHERE post_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error during GET request:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update a post
/**
 * @swagger
 * /community/posts/{id}:
 *   put:
 *     tags:
 *      - community
 *     summary: Update a community post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               post_date:
 *                 type: string
 *                 format: date-time
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.put('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const { title, content, post_date, latitude, longitude } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    try {
        const formattedDate = formatDateToMySQL(post_date);
        const [result] = await db.query(
            'UPDATE Community_Post SET title = ?, content = ?, post_date = ?, latitude = ?, longitude = ? WHERE post_id = ?',
            [title, content, formattedDate, latitude, longitude, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        console.error('Error during PUT request:', err);
        res.status(500).json({ error: err.message });
    }
});


// Delete a post
/**
 * @swagger
 * /community/posts/{id}:
 *   delete:
 *     tags:
 *      - community
 *     summary: Delete a community post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/posts/:id', async (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    try {
        const [result] = await db.query('DELETE FROM Community_Post WHERE post_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error during DELETE request:', err);
        res.status(500).json({ error: err.message });
    }
});


router.use('/likes', likeRouter);
router.use('/comment', commentRouter);
module.exports = router;
