var express = require('express');
const db = require('../services/database');
var router = express.Router();

const databaseError = new Error('Database could not be connected.');
const userModal = require('../models/users');

function registerPatient(placeholder) {
  return new Promise((resolve, reject) => {
      const query = 'INSERT patients (first_name, middle_name, last_name, age, ssn, address , race , gender, medical_history, phone_number, occupation, username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    db
      .queryDatabase(db.pool, query, placeholder)
      .then((results) => {
        resolve('The patient has been registered successfully!!')
      })
      .catch((e) => {
        reject(databaseError);
      });
  });
};

function getVaccines() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT name, availability, on_hold, company_name FROM vaccines';
    db
      .queryDatabase(db.pool, query, [])
      .then((results) => {
        resolve(results)
      })
      .catch((e) => {
        reject(databaseError);
      });
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/vaccines', async function(req, res, next) {
  try {
    const result = await getVaccines();
    res.send(result);
  } catch (error){
    res.status(500).send('Something went wrong!!')
  }
});

/* Register Patient */
router.post('/register', async function (req, res, next) {
  try {
    const patientInfo = req.body;
    const placeholder = [patientInfo.first_name, patientInfo.middle_name, patientInfo.last_name, patientInfo.age, patientInfo.ssn, patientInfo.address , patientInfo.race , patientInfo.gender, patientInfo.medical_history, patientInfo.phone_number, patientInfo.occupation, patientInfo.username ];
    const result = await registerPatient(placeholder);
    await userModal.addUserDetails(patientInfo.username, patientInfo.password, 'patient');
    res.send(result);
  } catch (error){
    res.status(500).send('Something went wrong!!')
  }
  
});

module.exports = router;
