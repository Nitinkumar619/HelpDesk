const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;


const generateToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      isAdmin: user.role === 'admin',
      role:user.role,
      id: user.id
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};


const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
