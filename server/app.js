require('dotenv').config();

const session = require('express-session');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch')
// const helmet = require('helmet'); // 1. helmet 패키지 불러오기
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


app.use(cors());
app.use(sessionConfig);

//passport 전용 middleware
app.use(passport.initialize());
app.use(passport.session());

<<<<<<< Updated upstream


// 루트 경로에 대한 처리 추가
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use('/notify', notifyRouter); // notify
app.use('/favorites', favoritesRouter); // favorites
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 정적 파일 제공을 위한 미들웨어 설정
=======
// // 2.helmet을 사용하여 보안 헤더 설정
// app.use(helmet());

// // 3.세부적인 CSP 설정 추가
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"], // 기본적으로 자기 자신만 허용
//         connectSrc: ["'self'", 'http://www.khoa.go.kr'], // 네트워크 요청을 허용할 소스
//         scriptSrc: ["'self'", "'unsafe-inline'"], // 스크립트 소스를 허용할 소스
//         styleSrc: ["'self'", "'unsafe-inline'"], // 스타일 소스를 허용할 소스
//         imgSrc: ["'self'", "data:", "https:"], // 이미지 소스를 허용할 소스
//         frameSrc: ["'self'"], // iframe 소스를 허용할 소스
//         objectSrc: ["'none'"], // 객체 태그를 비활성화
//         upgradeInsecureRequests: [] // HTTP 요청을 HTTPS로 업그레이드
//     }
// }));

app.get('/api/weather', async (req, res) => {
    const apiUrl = 'https://apihub.kma.go.kr/api/typ01/url/kma_buoy.php?tm=20240726&stn=0&help=1&authKey=UYw_-6P6SPeMP_uj-uj3Pw';
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

>>>>>>> Stashed changes
app.use('/community', communityRoutes); // community 
app.use('/zones', zonesRoutes); // zones.js 라우트
app.use('/auth', authRoutes); // 회원가입, 로그인 로직의 미들웨어를 적용
app.use('/api', apiRoutes); // 특정 경로에 대해서만 캐싱 미들웨어를 적용
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // swagger-ui

module.exports = app;