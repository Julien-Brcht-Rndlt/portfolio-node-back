const express = require('express');
const cors = require('cors');
const connection = require('./db-config');
const { setupRoutes } = require('./routes/setupRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

setupRoutes(app);

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
  } else {
    console.log(`connected as id ' ${connection.threadId}`);
  }
});

module.exports = app;