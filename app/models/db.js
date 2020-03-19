const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.CLEARDB_DATABASE_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

connection.connect(error => {
    if (error) throw  error;
    console.log('Successfully connected to the database');
});

module.exports = connection;
