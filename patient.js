var express = require('express');
const db = require('../services/database');
var router = express.Router();

const databaseError = new Error('Database could not be connected.')
const scheduleModal = require('../models/schedule');


function getPatient(filter, id) {
  return new Promise((resolve, reject) => {
      const query = filter === 'patient_id' ? 'SELECT * FROM patients where patient_id = ? ': 'SELECT * FROM patients where username = ?';

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

function getAllPatients() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM patients';
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

function getTimeSlots() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT slot_id, slot_name FROM time_slot';
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

function registerPatient(placeholder) {
  return new Promise((resolve, reject) => {
      const query = 'INSERT patients (first_name, middle_name, last_name, age, ssn, address , race , gender, medical_history, phone_number, occupation) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    db
      .queryDatabase(db.pool, query, placeholder)
      .then((results) => {
        resolve('The patient has been registered successfully!!')
      })
      .catch(() => {
        reject(databaseError);
      });
  });
}

function updatePatient(placeholder) {
  return new Promise((resolve, reject) => {
      const query = 'UPDATE patients SET first_name= ?, middle_name=?, last_name=?, age=?, ssn=?, address =?, race =?, gender=?, medical_history=?, phone_number=?, occupation=? WHERE patient_id=?';
    db
      .queryDatabase(db.pool, query, placeholder)
      .then((results) => {
        resolve('The patient has been updated successfully!!')
      })
      .catch(() => {
        reject(databaseError);
      });
  });
}

function getVaccineCount(vaccine) {
  return new Promise((resolve, reject) => {
      const query = 'select availability, id, on_hold from vaccines where name = ?;';
    db
      .queryDatabase(db.pool, query, [vaccine])
      .then((results) => {
        if (Array.isArray(results)) {
          resolve(results[0]);
        } else {
          reject(databaseError);
        }
      })
      .catch((e) => {
        reject(databaseError);
      });
  });
}

function addVaccineSchedule(placeholder) {
  return new Promise((resolve, reject) => {
      const query = 'INSERT vaccination_schedule (patient_id, date, timeslot_id, vaccine_id) VALUES (?,?,?,?);';
    db
      .queryDatabase(db.pool, query, placeholder)
      .then((results) => {
        resolve('Schedule has been added.');
      })
      .catch((err) => {
        reject(databaseError);
      });
  });
}

function updateVaccineCount(avail, onHold,vaccine) {
  return new Promise((resolve, reject) => {
      const query = 'Update vaccines SET availability=?, on_hold=? WHERE id=?;';
    db
      .queryDatabase(db.pool, query, [avail,onHold,vaccine])
      .then((results) => {
        resolve()
      })
      .catch((err) => {
        reject(databaseError);
      });
  });
}

function deleteAppointment(uuid) {
  return new Promise((resolve, reject) => {
      const query = 'Delete from vaccination_schedule where uuid=?';
    db
      .queryDatabase(db.pool, query, [uuid])
      .then((results) => {
        if(results.affectedRows > 0 ) {
          resolve('Appointment successfullly deleted');
        } else {
          reject(databaseError)
        }
        
      })
      .catch((err) => {
        reject(databaseError);
      });
  });
}

function getAppointments(patient_id) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM vaccination_schedule join time_slot on time_slot.slot_id=vaccination_schedule.timeslot_id join vaccines on vaccines.id = vaccination_schedule.vaccine_id where patient_id=?';
    db
      .queryDatabase(db.pool, query, [patient_id])
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(databaseError);
      });
  });
}


/* GET Patient */
router.get('/', async function (req, res, next) {
  try {
    const filter = req.query.username ? 'username' : 'patient_id';
    const idValue = req.query.username ? req.query.username : req.query.patient_id;
    const patients = await getPatient(filter, idValue);
    const result = patients[0];
    res.send(result);

  } catch {
    res.status(500).send('Something went wrong!!')
  }
});

/* GET all Patients */
router.get('/all', async function (req, res, next) {
  try {
    const patients = await getAllPatients();
    res.send(patients);

  } catch {
    res.status(500).send('Something went wrong!!')
  }
});

/* Register Patient */
router.post('/', async function (req, res, next) {
  try {
    const patientInfo = req.body;
    const placeholder = [patientInfo.first_name, patientInfo.middle_name, patientInfo.last_name, patientInfo.age, patientInfo.ssn, patientInfo.address , patientInfo.race , patientInfo.gender, patientInfo.medical_history, patientInfo.phone_number, patientInfo.occupation ];
    const result = await registerPatient(placeholder);
    res.send(result);
  } catch {
    res.status(500).send('Something went wrong!!')
  }
  
});

/* Update Patient Information */
router.put('/', async function (req, res, next) {
  try {
    const patientInfo = req.body;
    const placeholder = [patientInfo.first_name, patientInfo.middle_name, patientInfo.last_name, patientInfo.age, patientInfo.ssn, patientInfo.address , patientInfo.race , patientInfo.gender, patientInfo.medical_history, patientInfo.phone_number, patientInfo.occupation, patientInfo.patient_id ];
    const result = await updatePatient(placeholder);
    res.send(result);
  } catch {
    res.status(500).send('Something went wrong!!')
  }
  
});

/* GET all appointment */
router.get('/schedule', async function (req, res, next) {
  try {
    const patientInfo = req.query;

    // Delete the appointment
    const result = await getAppointments(patientInfo.patient_id);
    // Check if vaccine doses are available
    res.send(result);
  } catch {
    res.status(500).send('Something went wrong!!')
  }
  
});

/* GET all appointment */
router.get('/schedule/available', async function (req, res, next) {
  try {
    const avail = req.query;

     // Get time appointment
     const slots = await getTimeSlots();
     const result = [];

     for (let i = 0; i < slots.length; i++) {
       const element = slots[i];
       const currentAppointment = await scheduleModal.getCurrentSchedulesForTimeslot(element.slot_name, avail.date);
       const nurseCount = await scheduleModal.getNumOfNursesForTimeslot(element.slot_name, avail.date);
       const availApp = Math.min(100-currentAppointment,(nurseCount*10)-currentAppointment);
       element.availability = availApp;
        result.push(element);
     }

    res.send(result);
  } catch {
    res.status(500).send('Something went wrong!!')
  }
  
});

/* Schedule an appointment */
router.post('/schedule', async function (req, res, next) {
  try {
    const scheduleInfo = req.body;

    // Check if vaccine doses are available
    const vaccineCount = await getVaccineCount(scheduleInfo.vaccine);
    if (vaccineCount.availability < 1){
      res.status(400).send('Vaccine Not available!')
    }

    const maxAppointment = 100;

    // Check available appointments
    const currentAppointment = await scheduleModal.getCurrentSchedulesForTimeslot(scheduleInfo.timeslot, scheduleInfo.date);

    // Check the number of nurses 
    const nurseCount = await scheduleModal.getNumOfNursesForTimeslot(scheduleInfo.timeslot, scheduleInfo.date);
    if(nurseCount < 1){
      res.status(400).send('No Nurse is available to register the vaccine');
    }


    // Check if appointments are available
    const availApp = Math.min(maxAppointment-currentAppointment,(nurseCount*10)-currentAppointment);
    if ( availApp < 1){
      res.status(400).send('No available appointments!!');
    }
    

    // Get Slot id
    const slotId = await scheduleModal.getTimeslotId(scheduleInfo.timeslot);

    const placeholders = [scheduleInfo.patient_id, scheduleInfo.date, slotId.slot_id, vaccineCount.id]

    const result = await addVaccineSchedule(placeholders);
    const onHold = vaccineCount.on_hold + 1;
    const avail = vaccineCount.availability - 1;

    await updateVaccineCount(avail,onHold,vaccineCount.id);
    res.send(result);
  
  } catch (e) {
    res.status(500).send('Something went wrong!!')
  }
  
});

/* Delete an appointment */
router.delete('/schedule', async function (req, res, next) {
  try {
    const appointmentInfo = req.body;

    // Delete the appointment
    const result = await deleteAppointment(appointmentInfo.uuid);
    // Check if vaccine doses are available
    const vaccineCount = await getVaccineCount(appointmentInfo.vaccine);
    const onHold = vaccineCount.on_hold - 1;
    const avail = vaccineCount.availability + 1;
    await updateVaccineCount(avail,onHold,vaccineCount.id);
    res.send(result);
  } catch {
    res.status(500).send('Something went wrong!!')
  }
  
});



module.exports = router;
