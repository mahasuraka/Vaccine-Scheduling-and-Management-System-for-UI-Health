const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

//  Get application settings and secrets from config.json file
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const connInfo = {
 host: config.host,
 user: config.user,
 password: config.password,
 database: config.database,
};


const pool = mysql.createPool(connInfo);



function queryDatabase(database, query, parameters) {
  return new Promise((resolve, reject) => {
    database.query(query, parameters, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      const queryResult = JSON.parse(JSON.stringify(results));
      resolve(queryResult);
    });
  });
}


module.exports = {
  pool,
  queryDatabase
};