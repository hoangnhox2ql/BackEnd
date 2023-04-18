import { Router } from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { db } from '../database/connection.js'

const user_router = Router()
export { user_router }

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