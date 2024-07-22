const express = require('express');
const db = require('../config/dbConfig'); 

const router = express.Router(); 

router.get('/', (req, res) => {
    res.send('Surfing Zone and Diving Zone API');
});

// Surfing Zones Routes
router.get('/surfing-zones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Surfing_Zone');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// Diving Zones Routes
router.get('/diving-zones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Diving_Zone');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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
