function validateCommentInput(req, res, next) {
    const { post_id, username, content } = req.body;
    if (!post_id || !username || !content) {
        return res.status(400).json({ error: 'Post ID, username, and content are required' });
    }
    next();
}

module.exports = validateCommentInput;