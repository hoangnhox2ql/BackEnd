const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'data1'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database: ', error);
        return;
    }
    console.log('Connected to database successfully!');
});

module.exports = connection;