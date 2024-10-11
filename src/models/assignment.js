const { MongoClient} = require('mongodb');  
const { ObjectId } = require('mongodb');



//Database connection
const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);
const dbName = 'assignmentportal';

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db(dbName);
}

//Upload assignment
async function uploadAssignment(userId, task, admin) {
  const db = await connectDB();
  const assignmentsCollection = db.collection('assignments');

  const assignment = { userId, task, admin, status: 'Pending' };
  await assignmentsCollection.insertOne(assignment);
  console.log("Assignment uploaded");
  return assignment;
}

//Get assignments by admin
async function getAssignmentsByAdmin(adminUsername) {
  console.log("Fetching assignments for admin:", adminUsername); 
  const db = await connectDB();
  const assignmentsCollection = db.collection('assignments');

  //Querying the assignments by admin username
  const assignments = await assignmentsCollection.find({ admin: adminUsername }).toArray();
  console.log("Assignments found:", assignments); 
  return assignments;
}


//Accept assignment
async function acceptAssignment(assignmentId) {
  const db = await connectDB();
  const assignmentsCollection = db.collection('assignments');
  if (!ObjectId.isValid(assignmentId)) {
    throw new Error('Invalid assignmentId');
  }
  

  await assignmentsCollection.updateOne(
    { _id: ObjectId.createFromHexString(assignmentId) },
    { $set: { status: 'Accepted' } }
  );
  console.log("Assignment accepted");
}

// Reject assignment
async function rejectAssignment(assignmentId) {
  const db = await connectDB();
  const assignmentsCollection = db.collection('assignments');
  if (!ObjectId.isValid(assignmentId)) {
    throw new Error('Invalid assignmentId');
  }

  await assignmentsCollection.updateOne(
    { _id: ObjectId.createFromHexString(assignmentId) },  
    { $set: { status: 'Rejected' } }
  );
  console.log("Assignment rejected");
}

module.exports = { uploadAssignment, getAssignmentsByAdmin, acceptAssignment, rejectAssignment };


