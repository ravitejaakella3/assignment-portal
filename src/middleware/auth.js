const jwt = require('jsonwebtoken');

function authenticate(req, res, callback) {
  //Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ message: 'Access Denied. No token provided.' }));
  }

  //Get the token after 'Bearer '
  const token = authHeader.split(' ')[1];
  console.log('Token from header:', token); 

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: 'Invalid token.' }));
    }

    req.user = decoded; 
    callback();
  });
}

module.exports = { authenticate };




