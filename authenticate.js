/* eslint-disable func-names */
/* eslint-disable consistent-return */
//  Remote includes
const express = require('express');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');



//  Local includes
const userModal = require('../models/users');
//  Get application settings and secrets from config.json file
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

//  The router instance
const router = express.Router();


router.post('/', async (request, response) => {
  //  Validate client request
  let authenticateRecord = request.body;

  const userDetails = await userModal.getUserLoginDetails(authenticateRecord.username);
    if (userDetails[0].password !== authenticateRecord.password)
        response.status(403).json({ error: 'Username or password is invalid' });
    else {
        const payload = { username: authenticateRecord.username,  access: userDetails[0].access_level};
        const token = jwt.sign(payload, config.jwtSecret,{});
        response.json({ token });
    }
});

//  Given a token, verify it
//  If the sent token is verfitied, extract a netid and add that to the request object
function verifyToken(request, response, next) {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers['token'];
  if (!token)
    return response.status(403).json({ error: 'A valid token is required' });
  jwt.verify(token, config.jwtSecret, (error, decoded) => {
    if (error) return response.status(403).json({ error: 'Invalid token' });
    request.netid = decoded.netid;
    next();
  });
}

router.verifyToken = verifyToken;

module.exports = router;