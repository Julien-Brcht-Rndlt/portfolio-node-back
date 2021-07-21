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

router.patch('/:id', (req, res) => {

    const myselfId = req.params.id;
    const myselfValues = req.body;
    let myself = null;

    let sql = 'SELECT * FROM myself WHERE id = ?';

    connection.promise().query(sql, myselfId)
            .then(([results]) => {
                if(!results.length){
                    return Promise.reject('NOT_EXISTING_RESOURCES');
                } else {
                    myself = results[0];
                    sql = 'UPDATE myself SET ? WHERE id = ?';
                    return connection.promise().query(sql, [myselfValues, myselfId]);
                }
            })
            .then(() => {
                myself = { ...myself, ...myselfValues};
                res.status(200).json(myself);
            })
            .catch((err) => {
                if(err === 'NOT_EXISTING_RESOURCES'){
                    res.status(404).send(`Couldn't modify myself #${myselfId} resource, this resource doesn't exist!`);
                } else {
                    res.status(500).send(`Error server: ${err.message}`);
                }
            });
});

module.exports = router;