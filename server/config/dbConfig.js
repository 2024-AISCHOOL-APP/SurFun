const mysql = require('mysql2/promise');

async function getMySQLConnection() {
    return await mysql.createConnection({
        host: 'project-db-stu3.smhrd.com',
        user: 'Insa5_App_hacksim_6',
        password: 'aischool6',
        database: 'SurFun',
        port: 3307  // 포트 설정 추가
    });
}

module.exports = getMySQLConnection;
