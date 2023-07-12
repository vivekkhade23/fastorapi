const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const DbConnect= require('../fastorapi/src/config/DbConnect');
const routes = require('../fastorapi/src/router/fastor.router');

const app = express();

app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ error: 'No token provided.' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: 'Failed to authenticate token.' });
    }

    req.user = decoded;
    next();
  });
};

app.use('/enquiries/claimed', verifyToken);
app.use('/', routes);

app.listen(8080, () => {
  DbConnect()
  console.log('Server started on port 8080');
});
