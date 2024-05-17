var express = require('express');
const db = require('../services/database');
var router = express.Router();

const databaseError = new Error('Database could not be connected.')
const scheduleModal = require('../models/schedule');
const userModal = require('../models/users');

function getNurses(filter, id) {
    return new Promise((resolve, reject) => {
        const query = filter === 'employee_id' ? 'SELECT * FROM nurses where employee_id = ? ': 'SELECT * FROM nurses where username = ?';
      db
        .queryDatabase(db.pool, query, [id])
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

function getAllNurses() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM nurses';
    db
      .queryDatabase(db.pool, query, [])
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

function getVaccineId(vaccine) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM vaccines where name = ? ';
      db
        .queryDatabase(db.pool, query, [vaccine])
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

function registerNurses(placeholder) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT nurses (employee_id, first_name, middle_name, last_name, age, gender, address , phone_number, username ) VALUES (?,?,?,?,?,?,?,?, ?);';
      db
        .queryDatabase(db.pool, query, placeholder)
        .then((results) => {
          resolve('The patient has been registered successfully!!')
        })
        .catch((e) => {
          reject(databaseError);
        });
    });
}

function updateNurses(placeholder) {
return new Promise((resolve, reject) => {
    const query = 'UPDATE nurses SET first_name= ?, middle_name=?, last_name=?, age=?, gender=?, address =?, phone_number=? WHERE employee_id=?';
    db
    .queryDatabase(db.pool, query, placeholder)
    .then((results) => {
        resolve('The patient has been updated successfully!!')
    })
    .catch((e) => {
        reject(databaseError);
    });
});
}

function deleteNurse(placeholder) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM nurses where employee_id=?';
        db
        .queryDatabase(db.pool, query, placeholder)
        .then((results) => {
            resolve('The Nurse has been deleted successfully!!')
        })
        .catch(() => {
            reject(databaseError);
        });
    });
}

function deleteUser(placeholder) {
  return new Promise((resolve, reject) => {
      const query = 'DELETE FROM users where username = (select username from nurses where employee_id=?)';
      db
      .queryDatabase(db.pool, query, placeholder)
      .then((results) => {
          resolve()
      })
      .catch(() => {
          reject(databaseError);
      });
  });
}   

function getSchedules(employee_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM nurse_schedules join time_slot on nurse_schedules.timeslot_id=time_slot.slot_id where employee_id=?';
      db
        .queryDatabase(db.pool, query, [employee_id])
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(databaseError);
        });
    });
}

function addSchedules(placeholders) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT nurse_schedules (employee_id,date,timeslot_id) VALUES (?,?,?);';
      db
        .queryDatabase(db.pool, query, placeholders)
        .then((results) => {
            if(results.affectedRows > 0 ) {
                resolve('Schedules have been added successfully!');
              } else {
                reject(databaseError)
              }
        })
        .catch((err) => {
          console.log(err)
          reject(databaseError);
        });
    });
}

function deleteSchedules(uuid) {
    return new Promise((resolve, reject) => {
        const query = 'Delete from nurse_schedules where id=?';
      db
        .queryDatabase(db.pool, query, [uuid])
        .then((results) => {
          if(results.affectedRows > 0 ) {
            resolve('Scheduled successfullly deleted');
          } else {
            reject(databaseError)
          }
          
        })
        .catch((err) => {
          reject(databaseError);
        });
    });
}

function addVaccineRecord(placeholders) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT vaccine_records (patient_id,dose_no,vaccine_id) VALUES (?,?,?);';
      db
        .queryDatabase(db.pool, query, placeholders)
        .then((results) => {
            if(results.affectedRows > 0 ) {
                resolve('Vaccine records added successfully!');
              } else {
                reject(databaseError)
              }
        })
        .catch((err) => {
          reject(databaseError);
        });
    });
}

function getDoseCount(patient_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM vaccine_records where patient_id = ? ';
      db
        .queryDatabase(db.pool, query, [patient_id])
        .then((results) => {
          if (Array.isArray(results)) {
            resolve(results.length);
          } else {
            reject(databaseError);
          }
        })
        .catch(() => {
          reject(databaseError);
        });
    });
}

function getAppointments() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM vaccination_schedule join time_slot on time_slot.slot_id=vaccination_schedule.timeslot_id join vaccines on vaccines.id = vaccination_schedule.vaccine_id';
    db
      .queryDatabase(db.pool, query, [])
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(databaseError);
      });
  });
}

function updateAppointment(uuid) {
  return new Promise((resolve, reject) => {
      const query = 'Update vaccination_schedule SET status="completed" WHERE uuid=?';
    db
      .queryDatabase(db.pool, query, [uuid])
      .then((results) => {
        resolve()
      })
      .catch((err) => {
        reject(databaseError);
      });
  });
}

/* GET Nurses. */
router.get('/', async function (req, res, next) {
    try {
      const filter = req.query.username ? 'username' : 'employee_id';
      const idValue = req.query.username ? req.query.username : req.query.employee_id;
      const nurses = await getNurses(filter, idValue);
      const result = nurses[0];
      console.log(result)
      res.send(result);
  
    } catch {
      res.status(500).send('Something went wrong!!')
    }
});

/* GET All Nurses. */
router.get('/all', async function (req, res, next) {
  try {
    const nurses = await getAllNurses();
    res.send(nurses);

  } catch {
    res.status(500).send('Something went wrong!!')
  }
});

/* Register Nurse */
router.post('/', async function (req, res, next) {
    try {
      const nurseInfo = req.body;
      const placeholder = [nurseInfo.employee_id, nurseInfo.first_name, nurseInfo.middle_name, nurseInfo.last_name, nurseInfo.age, nurseInfo.gender , nurseInfo.address , nurseInfo.phone_number, nurseInfo.username];
      const result = await registerNurses(placeholder);
      await userModal.addUserDetails(nurseInfo.username, nurseInfo.password, 'nurse');
      res.send(result);
    } catch(e) {
      res.status(500).send('Something went wrong!!')
    }
    
});
  
/* Update Nurse Information */
router.put('/', async function (req, res, next) {
try {
    const nurseInfo = req.body;
    const placeholder = [nurseInfo.first_name, nurseInfo.middle_name, nurseInfo.last_name, nurseInfo.age, nurseInfo.gender, nurseInfo.address ,nurseInfo.phone_number, nurseInfo.employee_id ];
    const result = await updateNurses(placeholder);
    res.send(result);
} catch (e){
    res.status(500).send(new Error('Something went wrong!!'))
}

});

router.delete('/', async function (req, res, next) {
    try {
        const nurseInfo = req.body;
        const placeholder = [nurseInfo.employee_id];
        await deleteUser(placeholder);
        const result = await deleteNurse(placeholder);
        res.send(result);
    } catch {
        res.status(500).send(new Error('Something went wrong!!'))
    }
    
});

/* GET all Schedules */
router.get('/schedule', async function (req, res, next) {
try {
    const nurseInfo = req.query;
    const result = await getSchedules(nurseInfo.employee_id);
    res.send(result);
} catch(e) {
    res.status(500).send('Something went wrong!!')
}

});

/* Add an Schedule */
router.post('/schedule', async function (req, res, next) {
try {
    const scheduleInfo = req.body;

    // Check the current scheduled nurses
    const nurseCount = await scheduleModal.getNumOfNursesForTimeslot(scheduleInfo.timeslot, scheduleInfo.date);
    if(nurseCount>12){
        res.status(400).send('Maximum number of nurses are already scheduled for this timeslot');
    }
    // GEt timeslot id
    const slotId = await scheduleModal.getTimeslotId(scheduleInfo.timeslot);
    const placeholders = [scheduleInfo.employee_id,scheduleInfo.date,slotId.slot_id]
    console.log(placeholders)
    const result = await addSchedules(placeholders);
    res.send(result);

} catch (e){
  console.log(e)
    res.status(500).send('Something went wrong!!')
}

});

/* Delete an schedule */
router.delete('/schedule', async function (req, res, next) {
try {
    const scheduleInfo = req.body;

    // Delete the appointment
    const result = await deleteSchedules(scheduleInfo.uuid);
    res.send(result);
} catch {
    res.status(500).send('Something went wrong!!')
}

});

/* Register an vaccine Admitted */
router.post('/vaccine', async function (req, res, next) {
    try {
        const info = req.body;
    
        // GEt the vaccine id
        const vaccineId = await getVaccineId(info.vaccine);
        
        // Get num of doses
        const currentDose = await getDoseCount(info.patient_id)

        const placeholder = [info.patient_id, currentDose+1,vaccineId[0].id]
        // Add vaccine record
        const vaccineRecord = await addVaccineRecord(placeholder)
        await updateAppointment(info.uuid)
        res.send(vaccineRecord);
    } catch (e){
        res.status(500).send('Something went wrong!!')
    }
    
});

router.get('/vaccine', async function (req, res, next) {
  try {
      // Add vaccine record
      const allAppointments = await getAppointments()
      res.send(allAppointments);
  } catch (e){
      res.status(500).send('Something went wrong!!')
  }
  
});



module.exports = router;