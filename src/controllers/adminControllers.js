const { registerAdmin, findAdminByUsername, getAllAdmins } = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Register new admin
async function adminRegister(req, res, { username, password }) {
  try {
    await registerAdmin(username, password);
    res.statusCode = 201;
    res.end(JSON.stringify({ message: 'Admin registered successfully' }));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: error.message }));
  }
}


//Login for admin
async function adminLogin(req, res, { username, password }) {
  try {
    const admin = await findAdminByUsername(username);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Invalid username or password' }));
      return;
    }

    const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, 'secretkey', { expiresIn: '1h' });

    res.end(JSON.stringify({ token }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
  }
}


//Get all admins for user
async function allAdmins(req, res) {
  try {
    const admins = await getAllAdmins();
    res.end(JSON.stringify(admins));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
  }
}

module.exports = { adminRegister, adminLogin, allAdmins };


