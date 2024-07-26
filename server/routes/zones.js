const express = require('express');
const db = require('../config/dbConfig');

const router = express.Router(); 

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: API for managing surfing and diving zones
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns the API description
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', (req, res) => {
    res.send('Surfing Zone and Diving Zone API');
});

/**
 * @swagger
 * /zones/surfing-zones:
 *   get:
 *     summary: Get all surfing zones
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: A list of surfing zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   surfing_zone_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   difficulty_level:
 *                     type: string
 *                   average_wave_height:
 *                     type: number
 *                   nearby_facilities:
 *                     type: string
 */
router.get('/surfing-zones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Surfing_Zone');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /zones/surfing-zones/{id}:
 *   get:
 *     summary: Get a specific surfing zone by ID
 *     tags: [Zones]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the surfing zone
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single surfing zone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 surfing_zone_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 difficulty_level:
 *                   type: string
 *                 average_wave_height:
 *                   type: number
 *                 nearby_facilities:
 *                   type: string
 *       404:
 *         description: Surfing zone not found
 */
router.get('/surfing-zones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Surfing_Zone WHERE surfing_zone_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Surfing zone not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /zones/surfing-zones:
 *   post:
 *     summary: Create a new surfing zone
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               difficulty_level:
 *                 type: string
 *               average_wave_height:
 *                 type: number
 *               nearby_facilities:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 surfing_zone_id:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.post('/surfing-zones', async (req, res) => {
    const { name, description, latitude, longitude, difficulty_level, average_wave_height, nearby_facilities } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Surfing_Zone (name, description, latitude, longitude, difficulty_level, average_wave_height, nearby_facilities) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, latitude, longitude, difficulty_level, average_wave_height, nearby_facilities]
        );
        res.status(201).json({ surfing_zone_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /zones/diving-zones:
 *   get:
 *     summary: Get all diving zones
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: A list of diving zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   diving_zone_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   difficulty_level:
 *                     type: string
 *                   average_wave_height:
 *                     type: number
 *                   nearby_facilities:
 *                     type: string
 */
router.get('/diving-zones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Diving_Zone');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /zones/diving-zones/{id}:
 *   get:
 *     summary: Get a specific diving zone by ID
 *     tags: [Zones]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the diving zone
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single diving zone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 diving_zone_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 difficulty_level:
 *                   type: string
 *                 average_wave_height:
 *                   type: number
 *                 nearby_facilities:
 *                   type: string
 *       404:
 *         description: Diving zone not found
 */
router.get('/diving-zones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Diving_Zone WHERE diving_zone_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Diving zone not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /zones/diving-zones:
 *   post:
 *     summary: Create a new diving zone
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               difficulty_level:
 *                 type: string
 *               average_wave_height:
 *                 type: number
 *               nearby_facilities:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 diving_zone_id:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.post('/diving-zones', async (req, res) => {
    const { name, description, latitude, longitude, difficulty_level, average_wave_height, nearby_facilities } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Diving_Zone (name, description, latitude, longitude, difficulty_level, average_wave_height, nearby_facilities) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, latitude, longitude, difficulty_level, average_wave_height, nearby_facilities]
        );
        res.status(201).json({ diving_zone_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
