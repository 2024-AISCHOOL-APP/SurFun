const authService = require('../services/authService');

async function register(req, res) {
    const { username, password, email, phone_number, preference } = req.body;

    if (!username || !password || !phone_number) {
        return res.status(400).send('Username, password, and phone number are required');
    }

    try {
        await authService.registerUser(username, password, email, phone_number, preference);
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Error registering user');
    }
}

async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await authService.authenticateUser(username, password);
        req.session.userId = user.user_id;
        res.send('Login successful');
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Error logging in');
    }
}

function authenticateSession(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = { register, login, authenticateSession };
