const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();

function formatDateToMySQL(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * @swagger
 * /favorites:
 *   post:
 *     tags:
 *       - favorites
 *     summary: Add a new favorite for a surfing or diving zone
 *     description: Adds a new favorite entry for either a surfing zone or a diving zone. At least one of `surfing_zone_id` or `diving_zone_id` must be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user adding the favorite.
 *               surfing_zone_id:
 *                 type: integer
 *                 description: The ID of the surfing zone to be added as a favorite. Either this or `diving_zone_id` must be provided.
 *               diving_zone_id:
 *                 type: integer
 *                 description: The ID of the diving zone to be added as a favorite. Either this or `surfing_zone_id` must be provided.
 *               favorite_date:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the favorite was added, in ISO 8601 format.
 *               last_notified:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the last notification was sent, in ISO 8601 format.
 *     responses:
 *       201:
 *         description: Favorite added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Favorite added successfully'
 *                 zoneDetails:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                       format: float
 *                     longitude:
 *                       type: number
 *                       format: float
 *       400:
 *         description: Bad Request - Missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'At least one of surfing_zone_id or diving_zone_id must be provided'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Internal server error message'
 */
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

            await db.query('INSERT INTO Favorite (username, surfing_zone_id, favorite_date, latitude, longitude, last_notified) VALUES (?, ?, ?, ?, ?, ?)', 
                [username, surfing_zone_id, formattedFavoriteDate, latitude, longitude, formattedLastNotified]
            );
        }

        if (diving_zone_id) {
            const [zone] = await db.query('SELECT * FROM Diving_Zone WHERE diving_zone_id = ?', [diving_zone_id]);
            if (zone.length === 0) {
                return res.status(400).json({ error: 'Diving Zone does not exist' });
            }

            latitude = zone[0].latitude;
            longitude = zone[0].longitude;

            await db.query('INSERT INTO Favorite (username, diving_zone_id, favorite_date, latitude, longitude, last_notified) VALUES (?, ?, ?, ?, ?, ?)', 
                [username, diving_zone_id, formattedFavoriteDate, latitude, longitude, formattedLastNotified]
            );
        }

        res.status(201).json({ 
            message: 'Favorite added successfully',
            zoneDetails: { latitude, longitude }
        });
    } catch (err) {
        console.error('Error during POST request:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
