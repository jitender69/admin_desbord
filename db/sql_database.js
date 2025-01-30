// filepath: /c:/Users/jituc/OneDrive/Documents/node/shop-website/admin_desbord/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', // Replace with your host
  user: 'root', // Replace with your database username
  password: '', // Replace with your database password
  database: 'demo_db' // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;