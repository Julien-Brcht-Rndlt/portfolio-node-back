const router = require('express').Router();
const connection = require('../db-config');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM projects';
  connection
    .promise()
    .query(sql)
    .then(([results]) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: `Error while retrieving projects : ${err.message}` });
    });
});

module.exports = router;