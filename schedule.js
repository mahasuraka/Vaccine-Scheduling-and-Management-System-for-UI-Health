const db = require('../services/database');

const databaseError = new Error('Database could not be connected.')

function getNumOfNursesForTimeslot(timeslot, date) {
    return new Promise((resolve, reject) => {
        const query = 'select * from nurse_schedules join time_slot on nurse_schedules.timeslot_id = time_slot.slot_id where time_slot.slot_name = ? and date = DATE(?)';
      db
        .queryDatabase(db.pool, query, [timeslot, date])
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

function getCurrentSchedulesForTimeslot(timeslot, date) {
    return new Promise((resolve, reject) => {
        const query = 'select patient_id, vaccines.name from vaccination_schedule join time_slot on vaccination_schedule.timeslot_id = time_slot.slot_id join vaccines on vaccination_schedule.vaccine_id=vaccines.id  where time_slot.slot_name = ? and date = Date(?);';
      db
        .queryDatabase(db.pool, query, [timeslot,date])
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

function getTimeslotId(timeslot) {
    return new Promise((resolve, reject) => {
        const query = 'select slot_id from time_slot where slot_name = ? ';
      db
        .queryDatabase(db.pool, query, [timeslot])
        .then((results) => {
          if (Array.isArray(results)) {
            resolve(results[0]);
          } else {
            reject(databaseError);
          }
        })
        .catch(() => {
          reject(databaseError);
        });
    });
}







module.exports = { 
    getNumOfNursesForTimeslot,
    getCurrentSchedulesForTimeslot,
    getTimeslotId,
}