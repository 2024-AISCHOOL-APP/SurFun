const getMySQLConnection = require('../config/dbConfig');

async function executeQuery(query, params) {
    let connection;
    try {
        connection = await getMySQLConnection();
        const [results] = await connection.execute(query, params);
        return results;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = { executeQuery };
