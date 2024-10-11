const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');


//Database connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'assignmentportal';

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db(dbName);
}

//Register new admin
async function registerAdmin(username, password) {
  const db = await connectDB();
  const adminsCollection = db.collection('admins');

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = { username, password: hashedPassword, role: 'Admin' };

  await adminsCollection.insertOne(admin);
  console.log("Admin registered");
  return admin;
}

//Find admin by username
async function findAdminByUsername(username) {
  const db = await connectDB();
  const adminsCollection = db.collection('admins');
  
  return await adminsCollection.findOne({ username });
}

//Get all admins
async function getAllAdmins() {
  const db = await connectDB();
  const adminsCollection = db.collection('admins');
  return await adminsCollection.find({}, { projection: { username: 1, _id: 0 } }).toArray();
}

module.exports = { registerAdmin, findAdminByUsername, getAllAdmins };
