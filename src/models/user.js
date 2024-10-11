const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'assignmentportal';

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db(dbName);
}

//Register new user
async function registerUser(username, password) {
  const db = await connectDB();
  const usersCollection = db.collection('users');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword, role: 'User' };

  await usersCollection.insertOne(user);
  console.log("User registered");
  return user;
}

//Find user by username
async function findUserByUsername(username) {
  const db = await connectDB();
  const usersCollection = db.collection('users');
  
  return await usersCollection.findOne({ username });
}

module.exports = { registerUser, findUserByUsername };

