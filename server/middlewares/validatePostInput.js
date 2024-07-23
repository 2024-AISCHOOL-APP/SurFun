// validatePostInput.js
const validatePostInput = (req, res, next) => {
    const { username, title, content, post_date } = req.body;
    if (!username || !title || !content || !post_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    next();
};

module.exports = validatePostInput;
