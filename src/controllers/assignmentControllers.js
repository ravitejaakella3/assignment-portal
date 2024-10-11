const { getAssignmentsByAdmin, acceptAssignment, rejectAssignment } = require('../models/assignment');

// Get all assignments for admin
async function getAssignments(req, res) {
  try {
    const adminUsername = req.user.username; // Fetch admin's username from token
    console.log("Fetching assignments for admin:", adminUsername);
    const assignments = await getAssignmentsByAdmin(adminUsername); // Use username to fetch assignments
    console.log("Assignments fetched:", assignments); // Log fetched assignments
    res.end(JSON.stringify(assignments));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
  }
}

  
// Accept an assignment
async function accept(req, res) {
  const assignmentId = req.params._id; // Extract assignment ID from URL parameters
  try {
    await acceptAssignment(assignmentId); // Implement the logic in your model
    res.end(JSON.stringify({ message: 'Assignment accepted' }));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: error.message }));
  }
}

// Reject an assignment
async function reject(req, res) {
  const assignmentId = req.params._id; // Extract assignment ID from URL parameters
  try {
    await rejectAssignment(assignmentId); // Implement the logic in your model
    res.end(JSON.stringify({ message: 'Assignment rejected' }));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: error.message }));
  }
}


module.exports = { getAssignments, accept, reject };
