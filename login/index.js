const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// Register endpoint
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ username }, 'my_secret_key');
  res.json({ token });
});

// Update user info endpoint
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  const user = users.find(user => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.username = username;
  res.json(user);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});