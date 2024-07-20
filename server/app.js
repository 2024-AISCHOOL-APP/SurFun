const express = require('express');
const cors = require('cors');
const sessionConfig = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');
const cacheMiddleware =require('./middlewares/cacheMiddleware');
const apiRoutes =require('./routes/apiRoutes');

const app = express();

//Json 요청의 본문을 파싱하기 위해 Express의 기본 미들웨어를 사용
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(sessionConfig);

app.use('/auth', authRoutes);

//특정 경로에 대해서만 캐싱 미들웨어를 적용
app.use('api',cacheMiddleware,apiRoutes);


module.exports = app;
