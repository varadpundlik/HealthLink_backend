const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
    port: process.env.port || 5000,
    db_host: process.env.DB_HOST || 'mongodb://localhost:27017/healthlinkDB',
};

module.exports = config;