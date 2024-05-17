const db = require('../services/database');

const databaseError = new Error('Database could not be connected.')

function getUserLoginDetails(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users where username=?';
      db
        .queryDatabase(db.pool, query, [username])
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

function addUserDetails(username, password, access_level) {
  return new Promise((resolve, reject) => {
      const query = 'INSERT users (username, password, access_level) VALUES (?,?,?);';
    db
      .queryDatabase(db.pool, query, [username, password, access_level])
      .then((results) => {
        if(results.affectedRows > 0 ) {
          resolve('The user has been registered successfully!!');
        } else {
          reject(databaseError)
        }
      })
      .catch((e) => {
        reject(databaseError);
      });
  });
}


module.exports = { 
    getUserLoginDetails,
    addUserDetails,
}