const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();

function formatDateToMySQL(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

router.post('/', async (req, res) => {
    const { username, surfing_zone_id, diving_zone_id, favorite_date, last_notified } = req.body;

    if (!surfing_zone_id && !diving_zone_id) {
        return res.status(400).json({ error: 'At least one of surfing_zone_id or diving_zone_id must be provided' });
    }

    const formattedFavoriteDate = formatDateToMySQL(favorite_date);
    const formattedLastNotified = last_notified ? formatDateToMySQL(last_notified) : null;

    try {
        const [user] = await db.query('SELECT * FROM User WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Username does not exist' });
        }

        let latitude = null;
        let longitude = null;

        if (surfing_zone_id) {
            const [zone] = await db.query('SELECT * FROM Surfing_Zone WHERE surfing_zone_id = ?', [surfing_zone_id]);
            if (zone.length === 0) {
                return res.status(400).json({ error: 'Surfing Zone does not exist' });
            }

            latitude = zone[0].latitude;
            longitude = zone[0].longitude;

            const [result] = await db.query('INSERT INTO Favorite (username, surfing_zone_id, favorite_date, latitude, longitude, last_notified) VALUES (?, ?, ?, ?, ?, ?)', 
                [username, surfing_zone_id, formattedFavoriteDate, latitude, longitude, formattedLastNotified]
            );

            res.status(201).json({ 
                message: 'Favorite added successfully',
                id: result.insertId,
                zoneDetails: { latitude, longitude }
            });
            return;
        }

        if (diving_zone_id) {
            const [zone] = await db.query('SELECT * FROM Diving_Zone WHERE diving_zone_id = ?', [diving_zone_id]);
            if (zone.length === 0) {
                return res.status(400).json({ error: 'Diving Zone does not exist' });
            }

            latitude = zone[0].latitude;
            longitude = zone[0].longitude;

            const [result] = await db.query('INSERT INTO Favorite (username, diving_zone_id, favorite_date, latitude, longitude, last_notified) VALUES (?, ?, ?, ?, ?, ?)', 
                [username, diving_zone_id, formattedFavoriteDate, latitude, longitude, formattedLastNotified]
            );

            res.status(201).json({ 
                message: 'Favorite added successfully',
                id: result.insertId,
                zoneDetails: { latitude, longitude }
            });
            return;
        }
    } catch (err) {
        console.error('Error during POST request:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const [user] = await db.query('SELECT * FROM User WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Invalid username' });
        }

        const [favorites] = await db.query('SELECT * FROM Favorite WHERE username = ?', [username]);
        res.status(200).json(favorites);
    } catch (err) {
        console.error('Error during GET request:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM Favorite WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (err) {
        console.error('Error during DELETE request:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
