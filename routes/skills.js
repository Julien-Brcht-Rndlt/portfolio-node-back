const router = require('express').Router();
const connection = require('../db-config');
const joi = require('joi');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM skill';
  connection
    .promise()
    .query(sql)
    .then(([results]) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: `Error while retrieving skills : ${err.message}` });
    });
});

router.post('/', (req, res) => {
    const { label, level } = req.body;

    const { error: validationErrors } = joi.object({
        label: joi.string().max(80).required(),
        level: joi.string().max(50),
    }).validate( { label, level }, { abortEarly: false });

    if(validationErrors) {
        res.status(422).json({ errors: validationErrors.details })
    } else {

        const sql = 'INSERT INTO skill (label, level) VALUES (?, ?)';

        connection.promise().query(sql, [label, level])
                    .then(([{insertId}]) => {
                        res.status(201).json({ insertId, label, level });
                    })
                    .catch((err) => {
                        res.status(500).send(`Error server: ${err.message}`);
                    });
    }
});

module.exports = router;