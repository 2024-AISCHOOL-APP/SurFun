const authService = require('../services/authService');

async function register(req, res) {
    const { username, password, email, phone_number, preference } = req.body;

    if (!username || !password || !phone_number) {
        return res.status(400).send('Username, password, and phone number are required');
    }

    try {
        await authService.registerUser(username, password, email, phone_number, preference);
        await authService.addSocialLogin(username, 'local', null); // 로컬 사용자의 소셜 로그인 정보 추가
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
        req.session.userId = user.user_id;  //세션에 사용자 ID 저장
        res.send({ message: 'Login successful', username: user.username });  // 사용자 이름 반환
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Error logging in');
    }
}

async function googleCallback(req, res){
    if(req.user){
        const profile = req.user;
        const user = await authService.findOrCreateUser(profile);
        req.session.userId=req.user.user_id; //세션에 사용자 ID 저장
        res.redirect(`/?username=${req.user.username}`); //사용자 이름을 쿼리 파라미터로 전달
    }else{
        res.redirect('/'); //실패시 홈으로 리다이렉트
    }
}

function authenticateSession(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

module.exports = { register, login, authenticateSession ,googleCallback };
