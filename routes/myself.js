const router = require('express').Router();
const connection = require('../db-config');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM myself';
  connection
    .promise()
    .query(sql)
    .then(([results]) => results && results.length ? results[0] : {})
    .then((myself) => res.status(200).json(myself))
    .catch((err) => {
      res.status(500).json({ message: `Error while retrieving personal infos : ${err.message}` });
    });
});

module.exports = router;