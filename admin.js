var express = require('express');
const db = require('../services/database');
var router = express.Router();

const databaseError = new Error('Database could not be connected.')
const scheduleModal = require('../models/schedule');

function getVaccineId(vaccine) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT id, availability FROM vaccines where name = ? ';
    db
      .queryDatabase(db.pool, query, [vaccine])
      .then((results) => {
        resolve(results)
      })
      .catch((e) => {
        console.log(e);
        reject(databaseError);
      });
  });
}

function getAdminsByUsername(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM admins where username = ?;';
        const placeholders = [username];
      db
        .queryDatabase(db.pool, query, placeholders)
        .then((results) => {
          if (Array.isArray(results)) {
            resolve(results);
          } else {
            reject(databaseError);
          }
        })
        .catch(() => {
          reject(databaseError);
        });
    });
  }

  function addVaccine(placeholder) {
    return new Promise((resolve, reject) => {
      const query = 'Update vaccines SET availability=? where id = ?;';
    db
      .queryDatabase(db.pool, query, placeholder)
      .then((results) => {
        if (results.affectedRows > 0) {
          resolve(results);
        } else {
          reject(databaseError);
        }
      })
      .catch(() => {
        reject(databaseError);
      });
  });
}

/* GET Admin Info. */
router.get('/', async function (req, res, next) {
    try {
      const admins = await getAdminsByUsername(req.query.username);
      const result = admins[0];
      res.send(result);
  
    } catch {
      res.status(500).send('Something went wrong!!')
    }
});
  

/* Add Vaccine Inventory. */
router.post('/vaccine', async function (req, res, next) {
  try {
    const vaccineInfo = req.body;
    // GEt the vaccine id & current count
    const vaccineId = await getVaccineId(vaccineInfo.vaccine);
    const admins = await addVaccine([parseInt(vaccineId[0].availability) + parseInt(vaccineInfo.dose), vaccineId[0].id]);
    const result = admins[0];
    res.send(result);

  } catch (e){
    console.log(e);
    res.status(500).send('Something went wrong!!')
  }
});

module.exports = router;