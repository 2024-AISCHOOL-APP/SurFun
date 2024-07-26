require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const db = require('../config/dbConfig');
const express = require('express');
const router = express.Router();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Twilio 설정
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// 날씨 데이터를 가져오는 함수
async function fetchWeather(latitude, longitude) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                lat: latitude,
                lon: longitude,
                appid: API_KEY,
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications management
 */

/**
 * @swagger
 * /notificationService/notifications/check:
 *   get:
 *     summary: Check for weather changes and send notifications
 *     description: Trigger a check for weather changes and send notifications if there are changes.
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Successfully checked for weather changes and sent notifications.
 *       500:
 *         description: Internal server error.
 */
async function checkWeatherChanges(req, res) {
    let connection;
    try {
        connection = await db.getConnection();
        console.log('Database connection established');

        // 모든 즐겨찾기 항목 가져오기
        const [favorites] = await connection.execute(
            'SELECT * FROM Favorite WHERE (latitude IS NOT NULL AND longitude IS NOT NULL)'
        );
        console.log('Favorites retrieved:', favorites);

        for (const favorite of favorites) {
            const { latitude, longitude } = favorite;

            if (!latitude || !longitude) {
                console.warn(`Skipping favorite with missing coordinates: ${JSON.stringify(favorite)}`);
                continue;
            }

            // 날씨 데이터 가져오기
            const weatherData = await fetchWeather(latitude, longitude);
            console.log('Weather data fetched:', weatherData);

            const weatherCondition = weatherData.weather[0].description;
            const temperature = weatherData.main.temp;

            // 이전 날씨 데이터 가져오기
            const [oldWeatherRows] = await connection.execute(
                'SELECT * FROM Weather WHERE latitude = ? AND longitude = ? ORDER BY last_updated DESC LIMIT 1',
                [latitude, longitude]
            );

            let weatherChanged = false;

            if (oldWeatherRows.length > 0) {
                const oldWeather = oldWeatherRows[0];
                if (temperature !== oldWeather.temperature || weatherCondition !== oldWeather.weather_condition) {
                    weatherChanged = true;
                }
            } else {
                // 이전 날씨 데이터가 없는 경우, 날씨가 변동된 것으로 간주합니다.
                weatherChanged = true;
            }

            if (weatherChanged) {
                // 날씨가 변동된 경우 사용자에게 알림 전송
                const [userRows] = await connection.execute(
                    'SELECT * FROM User WHERE username IN (SELECT username FROM Favorite WHERE id = ?)',
                    [favorite.id]
                );
                console.log('Users retrieved:', userRows);

                for (const user of userRows) {
                    const message = `즐겨찾기한 날씨는 ${weatherCondition} ${temperature}°C.`;

                    // 이메일 발송
                    if (user.email) {
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: user.email,
                            subject: 'Weather Update',
                            text: message
                        });
                        console.log(`Email sent to ${user.email}`);
                    }

                    // SMS 발송
                    if (user.phone_number) {
                        await twilioClient.messages.create({
                            body: message,
                            from: twilioPhoneNumber,
                            to: user.phone_number
                        });
                        console.log(`SMS sent to ${user.phone_number}`);
                    }

                    // 알림 기록 저장
                    await connection.execute(
                        'INSERT INTO Notifications (user_id, message) VALUES (?, ?)',
                        [user.username, message]
                    );
                    console.log(`Notification saved for user ${user.username}`);
                }

                // 날씨 데이터 저장
                await connection.execute(
                    'INSERT INTO Weather (latitude, longitude, weather_condition, temperature, last_updated) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE weather_condition = VALUES(weather_condition), temperature = VALUES(temperature), last_updated = VALUES(last_updated)',
                    [latitude, longitude, weatherCondition, temperature]
                );
                console.log(`Weather data updated for ${latitude}, ${longitude}`);
            }

            // 마지막 알림 시간 업데이트
            await connection.execute(
                'UPDATE Favorite SET last_notified = NOW() WHERE id = ?',
                [favorite.id]
            );
        }

        res.status(200).send('Successfully sent notifications.');
    } catch (error) {
        console.error('Error checking weather changes:', error);
        res.status(500).send('Internal server error.');
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// 라우트 설정
router.get('/notifications/check', checkWeatherChanges);

// 1시간마다 알림 전송
const runCheckWeatherChanges = async () => {
    try {
        await checkWeatherChanges({}, { status: () => ({ send: () => {} }) });
    } catch (error) {
        console.error('Error in interval function:', error);
    }
};
setInterval(runCheckWeatherChanges, 3600000);

module.exports = router;
