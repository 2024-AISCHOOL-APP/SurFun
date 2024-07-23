require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sessionConfig = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');
const cacheMiddleware =require('./middlewares/cacheMiddleware');
const apiRoutes =require('./routes/apiRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const zonesRoutes = require('./routes/zones'); 
const communityRoutes = require('./routes/community'); 

const app = express();

const swaggerOption ={
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title: 'API Documentation',
            version:'1.0.0',
            description:'API Documentation for the application'
        },
        servers:[
            {
                url: 'http://localhost:5000',
                description:'Development server'
            }
        ]
    },
    apis:['./routes/*.js'] //api경로 수정 부분
};
const swaggerDocs =swaggerJsdoc(swaggerOption);

//Json 요청의 본문을 파싱하기 위해 Express의 기본 미들웨어를 사용
app.use(express.json());
app.use(cors());
app.use(sessionConfig);

app.use('/community', communityRoutes); // community 
app.use('/zones', zonesRoutes); // zones.js 라우트
app.use('/auth', authRoutes); //회원가입,로그인 로직 에서의 미들웨어를 적용
app.use('/api',apiRoutes); //특정 경로에 대해서만 캐싱 미들웨어를 적용
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));  //swagger-ui

module.exports = app;
