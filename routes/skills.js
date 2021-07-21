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

router.patch('/:id', (req, res) => {

    const skillId = req.params.id;
    const skillValues = req.body;
    let skill = null;

    let sql = 'SELECT * FROM skill WHERE id = ?';

    connection.promise().query(sql, skillId)
            .then(([results]) => {
                if(!results.length){
                    return Promise.reject('NOT_EXISTING_RESOURCES');
                } else {
                    skill = results[0];
                    sql = 'UPDATE skill SET ? WHERE id = ?';
                    return connection.promise().query(sql, [skillValues, skillId]);
                }
            })
            .then(() => {
                skill = { ...skill, ...skillValues};
                res.status(200).json(skill);
            })
            .catch((err) => {
                if(err === 'NOT_EXISTING_RESOURCES'){
                    res.status(404).send(`Couldn't modify skill #${skillId} resource, this resource doesn't exist!`);
                } else {
                    res.status(500).send(`Error server: ${err.message}`);
                }
            });
});

router.delete('/:id', (req, res) => {

    const skillId = req.params.id;

    const sql = 'DELETE FROM skill WHERE id = ?';

    connection.promise().query(sql, skillId)
            .then(([result]) => {
            if(result.affectedRows){
                res.sendStatus(204);
            } else {
                res.status(404).send(`Couldn't delete skill #${skillId} resource, this resource doesn't exist!`);
            }
            })
            .catch((err) => {
                res.status(500).send(`Error server: ${err.message}`);
            });
});


module.exports = router;