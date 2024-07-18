const bcrypt = require('bcryptjs');
const db = require('../models/db');

async function registerUser(username, password, email, phoneNumber, preference) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO Users (username, password, email, phone_number, preference) VALUES (?, ?, ?, ?, ?)`;
    const params = [username, hashedPassword, email, phoneNumber, preference];
    await db.executeQuery(query, params);
}

async function authenticateUser(username, password) {
    const query = `SELECT * FROM Users WHERE username = ?`;
    const users = await db.executeQuery(query, [username]);

    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
}

module.exports = { registerUser, authenticateUser };
