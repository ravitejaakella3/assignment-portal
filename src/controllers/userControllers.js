const { registerUser, findUserByUsername, getAllAdmins } = require('../models/user');
const { uploadAssignment } = require('../models/assignment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//user register
async function register(req, res, { username, password }) {
  try {
    await registerUser(username, password);
    res.statusCode = 201;
    res.end(JSON.stringify({ message: 'User registered successfully' }));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: error.message }));
  }
}
  

//user login
  async function login(req, res, { username, password }) {
    try {
      const user = await findUserByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid username or password' }));
        return;
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
      res.end(JSON.stringify({ token }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  }
  
// Upload assignment
async function upload(req, res, body) {
    try {
      // Check if body is a string and needs to be parsed
      const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
      const { task, admin } = parsedBody;
  
      if (!task || !admin) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: 'Task and Admin are required fields' }));
      }
  
      // Simulating the user ID from authenticated user
      const userId = req.user ? req.user.id : null;
      if (!userId) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ message: 'Unauthorized: No user found' }));
      }
  
      const assignment = await uploadAssignment(userId, task, admin);
  
      res.statusCode = 201;
      res.end(JSON.stringify({ message: 'Assignment uploaded successfully', assignment }));
  
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: error.message }));
    }
  }
  
module.exports = { register, login, upload };
