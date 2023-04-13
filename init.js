const connection = require('./connection');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require("mysql2");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const initDatabase = () => {
    const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255),
            gneder boolean,
            age INT
        );
    `;

    connection.query(usersTableQuery, (error, result) => {
        if (error) {
            console.error('Error creating users table: ', error);
            return;
        }
        console.log('Users table created successfully!');
    });
};

initDatabase();

module.exports = connection;

const id = 1;
const name = 'Hoang';
const gender = true;
const age = 20;

connection.query('INSERT INTO users(id,name,gneder,age) VALUES (?,?,?,?)', [id,name,gender,age],(error, result) => {
    console.log(error);
    console.log( result);
});

// lấy tất cả thông tin user
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (error, result) => {
        console.error(error);
        res.send(result);
    });
});
// lấy thông tin user theo id
app.get('/users/:id',(req,res) =>{
    const query = 'SELECT ?,name,gneder,age FROM users';
    const {id} = req.params;
    connection.query(query,[id],(error,result) => {
        console.log(error);
        res.send(result);
    })
})

// thêm mới một user
app.post('/users', (req, res) => {
    const { name, gneder,age } = req.body;
    const query = 'INSERT INTO users (name, gneder,age) VALUES (?, ?, ?)';
    connection.query(query, [name, gneder,age], (error, result) => {
        console.log(error)
        res.send('User added successfully!');
    });
});

// cập nhật thông tin user theo id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, gneder,age } = req.body;
    const query = 'UPDATE users SET name = ?, gneder = ?, age = ? WHERE id = ?';
    connection.query(query, [name, gneder, age, id], (error, result) => {
        console.log(error);
        res.send('User updated successfully!');
    });
});

// xóa một user theo id
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [id], (error, result) => {
        console.log(error)
        res.send('User deleted successfully!');
    });
});
app.listen(3000, () => {
    console.log('Server started on port 3000');
});