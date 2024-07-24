const bcrypt = require('bcryptjs');
const db = require('../models/db');

async function findOrCreateUser(profile) {
    const username = profile.displayName;
    const email = profile.emails[0].value;
    const provider = 'google';
    const provider_id = profile.id;

    let user = await db.query('SELECT * FROM User WHERE username = ?', [username]);

    if (user.length === 0) {
        await db.query('INSERT INTO User (username, email) VALUES (?, ?)', [username, email]);
        await db.query('INSERT INTO Social_Logins (username, provider, provider_id) VALUES (?, ?, ?)', [username, provider, provider_id]);
        user = await db.query('SELECT * FROM User WHERE username = ?', [username]);
    }

    return user[0];
}

async function findUserByUsername(username) {
    const user = await db.query('SELECT * FROM User WHERE username = ?', [username]);
    return user[0];
}

async function registerUser(username, password, email, phoneNumber, preference) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO User (username, password, email, phone_number, preference) VALUES (?, ?, ?, ?, ?)`;
    const params = [username, hashedPassword, email, phoneNumber, preference];
    await db.executeQuery(query, params);
}

async function authenticateUser(username, password) {
    const query = `SELECT * FROM User WHERE username = ?`;
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

module.exports = { findOrCreateUser, findUserByUsername, registerUser, authenticateUser };
