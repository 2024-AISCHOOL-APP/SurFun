// dbConfig.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'project-db-stu3.smhrd.com',
  user: 'Insa5_App_hacksim_6',
  password: 'aischool6',
  database: 'Insa5_App_hacksim_6',
  port: 3307,  // 포트 설정 추가
  waitForConnections: true
});

module.exports = pool.promise();
