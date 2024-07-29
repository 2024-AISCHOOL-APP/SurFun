require('dotenv').config();

const session = require('express-session');
const express = require('express');
const cors = require('cors');
const sessionConfig = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');
const cacheMiddleware = require('./middlewares/cacheMiddleware');
const apiRoutes = require('./routes/apiRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const passport = require('./config/passportConfig');
const zonesRoutes = require('./routes/zones'); 
const communityRoutes = require('./routes/community'); 
const path = require('path');
const favoritesRouter = require('./routes/favorites');
const notifyRouter = require('./routes/notify');
const notificationServiceRouter = require('./routes/notificationService');
const commentRouter = require('./routes/comment');    
const likesRouter = require('./routes/likes');
const newsRoutes = require('./routes/newsRoutes');

 
const app = express();
const swaggerOption ={
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation for the application'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/*.js'] // API 경로 수정 부분
};
const swaggerDocs = swaggerJsdoc(swaggerOption);

app.use(express.json());//Json 요청의 본문을 파싱하기 위해 Express의 기본 미들웨어를 사용

//google 소셜 설정(MiddleWare)
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',  // 비밀 키를 환경 변수에서 가져오거나 기본값 설정
    resave: false,
    saveUninitialized: true
}));

app.use(cors({
    origin:'*', //이후에 허용 도메인 수정
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));
app.use(sessionConfig);

//passport 전용 middleware
app.use(passport.initialize());
app.use(passport.session());


// 루트 경로에 대한 처리 추가
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use('/community', likesRouter);  // likes
app.use('/community', commentRouter);  // comment
app.use('/notificationService', notificationServiceRouter); // notificationService
app.use('/notify', notifyRouter); // notify
app.use('/favorites', favoritesRouter); // favorites
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 정적 파일 제공을 위한 미들웨어 설정
app.use('/community', communityRoutes); // community 
app.use('/zones', zonesRoutes); // zones.js 라우트
app.use('/auth', authRoutes); // 회원가입, 로그인 로직의 미들웨어를 적용
app.use('/api', apiRoutes); // 특정 경로에 대해서만 캐싱 미들웨어를 적용
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // swagger-ui
app.use('/api/news',newsRoutes);
// 동적 import 사용
const fetchData = async () => {
    const { default: fetch } = await import('node-fetch');
    // fetch 사용 코드
};

fetchData().catch(err => console.error(err));

module.exports = app;
