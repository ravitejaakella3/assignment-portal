const http = require('http');
const { register, login, upload } = require('./controllers/userControllers');
const { adminRegister, adminLogin, allAdmins } = require('./controllers/adminControllers');
const { authenticate } = require('./middleware/auth');
const { getAssignments, accept, reject } = require('./controllers/assignmentControllers');

const server = http.createServer(async (req, res) => { 
  const { method, url } = req;

  console.log(`Received request: ${method} ${url}`);

  res.setHeader('Content-Type', 'application/json');

  //Handle request body
  let body = '';
  req.on('data', chunk => body += chunk.toString());

  req.on('end', async () => {  
    try {
      if (method === 'POST' && url === '/user/register') {
        const parsedBody = JSON.parse(body);
        register(req, res, parsedBody);
      } else if (method === 'POST' && url === '/user/login') {
        const parsedBody = JSON.parse(body);
        login(req, res, parsedBody);
      } else if (method === 'GET' && url === '/user/allAdmins') {  
        allAdmins(req, res); 
      } else if (method === 'POST' && url === '/user/upload') {
        authenticate(req, res, () => {
          const parsedBody = JSON.parse(body);
          upload(req, res, parsedBody);
        });
      } else if (method === 'POST' && url === '/admin/register') {
        const parsedBody = JSON.parse(body);
        adminRegister(req, res, parsedBody);
      } else if (method === 'POST' && url === '/admin/login') {
        const parsedBody = JSON.parse(body);
        adminLogin(req, res, parsedBody);
      } else if (method === 'GET' && url === '/admin/assignments') {
        authenticate(req, res, () => getAssignments(req, res));
      } else if (method === 'POST' && url.match(/^\/admin\/assignments\/([a-zA-Z0-9]+)\/accept$/)) {
        const assignmentId = url.split('/')[3]; 
        req.params = { _id: assignmentId }; 
        await accept(req, res);  
      } else if (method === 'POST' && url.match(/^\/admin\/assignments\/([a-zA-Z0-9]+)\/reject$/)) {
        const assignmentId = url.split('/')[3]; 
        req.params = { _id: assignmentId }; 
        await reject(req, res);  
      } else {
        // If no route matches
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Route not found' }));
      }
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});

