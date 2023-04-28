const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');
const { request } = require('http');
const mysql = require('mysql2');


const app = express();
const key = crypto.generateKeyPairSync('rsa',{modulusLength : 2048});

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'data1',
    multipleStatements : false
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!!!")
  });


const publicKey = key.publicKey;
const privateKey = key.privateKey;

const dbs = [
    {
        username: 'hoang',
        age: 22,
        email: 'hoang@gmail.com',
        id: 1,
        password: 'hoang12345',
        balance: 1000000,
    },
    {
        username: 'h',
        age: 24,
        email: 'h@gmail.com',
        id: 2,
        password: 'h12345',
        balance: 1000000000,
    },
];

app.use(express.json());

app.post('/login', function (req, res, next) {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    // Find user in db
        const user = dbs.find(u => {
            console.log(u.username);
            console.log(username);
             return u.username === username;
            
        }
            );
    // Case 1: User does not exist
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }

    // Case 2: Found user with that username
    if (user.password === password) {
        // Sign a jwt
        const jwt = jsonwebtoken.sign({
            username: user.username,
            email: user.email,
            age: user.age,
        }, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
        });

        // Return jwt to user
        return res.status(200).json({
            data: jwt,
            message: 'Login success',
        });
    }

    return res.status(401).json({
        message: 'Invalid credentials',
    });
});

app.get('/balance', (req, res, next) => {
    // Get username from query string
    const username = req.query.username;
    // Get token from request
    const authorizationHeader = req.headers.authorization;
    // authorizationHeader = 'Bearer <TOKEN>'
    // => token: authorizationHeader.substring(7)
    const userToken = authorizationHeader.substring(7);
    
    // Verify token
    try {
        const isTokenValid = jsonwebtoken.verify(userToken, publicKey);
        
        // Authorization success
        if (isTokenValid.username == username) {
            const user = dbs.find(u => u.username === username);

            return res.status(200).json({
                balance: user.balance,
            });
        }

        // Authorization failed
        return res.status(401).json({
            message: 'unauthorized',
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }
});
router.post('/login', async function(req, res) {
    const {
        username,
        password,
    } = req.body;
    const isUserExisted = await getOne({
        db,
        query: 'SELECT * FROM users WHERE username = ?',
        params: username,
    });
});
app.listen(3000, () => console.log('Server is listening on PORT 3000'));
router.post('/register',async function(req,res){
    const {
        username,
        password,
        gneder,
        name,   
        age,
        email,
    } = req.body;
    
});
const isUserExisted = await getOne({
    db,
    query: 'SELECT * FROM users WHERE username =?',
    params : username,
});
if(isUserExisted)
{
    return res.status(400).json({
        message : 'User already exist',
    });
}
const {
    hashPassword,
    salt,
} = hashPassword(password);
const isUserCreated = await create({
    query : 'INSERT INTO users(username,password,salt,name,email,age,gender) VALUE (?,?,?,?,?,?,?)',
    params : {
        username,
        hashPassword,
        salt,
        name, 
        email,
        age,
        gender,
    },
});
if(isUserCreated)
{
    return res.status(200).json({
        message : 'Register succesfully',
    });
}
return res.status(500).json({
    message : 'Internal server error',
});

