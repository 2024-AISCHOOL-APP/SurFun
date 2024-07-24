const express = require('express');
const db = require('../config/dbConfig');
const router = express.Router();

function formatDateToMySQL(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * @swagger
 * /notify:
 *   post:
 *     tags:
 *       - favorites
 *     summary: Send a notification for a user's favorite zone
 *     description: Sends a notification to the user for their favorite surfing or diving zone. Updates the last_notified field if the notification is sent.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user to send the notification to.
 *               surfing_zone_id:
 *                 type: integer
 *                 description: The ID of the surfing zone for which the notification is to be sent.
 *               diving_zone_id:
 *                 type: integer
 *                 description: The ID of the diving zone for which the notification is to be sent.
 *               notify_method:
 *                 type: string
 *                 enum: [email, sms]
 *                 description: The method of notification. Can be `email` or `sms`.
 *     responses:
 *       200:
 *         description: Notification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Notification sent'
 *       404:
 *         description: Favorite not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Favorite not found'
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
    const { username, surfing_zone_id, diving_zone_id, notify_method } = req.body;

    if (!username || (!surfing_zone_id && !diving_zone_id) || !notify_method) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let query = 'SELECT * FROM Favorite WHERE username = ? AND (';
        let queryParams = [username];

        if (surfing_zone_id) {
            query += 'surfing_zone_id = ?';
            queryParams.push(surfing_zone_id);
        }

        if (diving_zone_id) {
            if (surfing_zone_id) {
                query += ' OR ';
            }
            query += 'diving_zone_id = ?';
            queryParams.push(diving_zone_id);
        }

        query += ')';

        const [favorites] = await db.query(query, queryParams);

        if (favorites.length === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        const favorite = favorites[0];
        const now = new Date();
        const lastNotified = favorite.last_notified ? new Date(favorite.last_notified) : null;
        const timeSinceLastNotified = lastNotified ? now - lastNotified : Infinity;

        if (timeSinceLastNotified > 24 * 60 * 60 * 1000) {

            const [updateResult] = await db.query('UPDATE Favorite SET last_notified = ? WHERE id = ?', [formatDateToMySQL(now), favorite.id]);

            if (updateResult.affectedRows === 0) {
                return res.status(500).json({ error: 'Failed to update last_notified' });
            }

            res.status(200).json({ message: 'Notification sent' });
        } else {
            res.status(200).json({ message: 'Notification not required' });
        }
    } catch (err) {
        console.error('Error during notification request:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
