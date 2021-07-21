const router = require('express').Router();
const joi = require('joi');
const connection = require('../db-config');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM project';
  connection
    .promise()
    .query(sql)
    .then(([results]) => res.status(200).json(results))
    .catch((err) => {
      res.status(500).json({ message: `Error while retrieving projects : ${err.message}` });
    });
});

router.post('/', (req, res) => {
    const { title, main_img, desc, github, url } = req.body;

    const { error: validationErrors } = joi.object({
        title: joi.string().max(45).required(),
        main_img: joi.string().max(100),
        desc: joi.string(),
        github: joi.string().max(255),
        url: joi.string().max(255),
    }).validate( { title, main_img, desc, github, url }, { abortEarly: false });

    if(validationErrors) {
        res.status(422).json({ errors: validationErrors.details })
    } else {

        const sql = 'INSERT INTO project (`title`, `main_img`, `desc`, `github`, `url`) VALUES (?, ?, ?, ?, ?)';

        connection.promise().query(sql, [title, main_img, desc, github, url])
                    .then(([{insertId}]) => {
                        res.status(201).json({ insertId, title, main_img, desc, github, url });
                    })
                    .catch((err) => {
                        res.status(500).send(`Error server: ${err.message}`);
                    });
    }
});

router.patch('/:id', (req, res) => {

    const projectId = req.params.id;
    const projectValues = req.body;
    let project = null;

    let sql = 'SELECT * FROM project WHERE id = ?';

    connection.promise().query(sql, projectId)
            .then(([results]) => {
                if(!results.length){
                    return Promise.reject('NOT_EXISTING_RESOURCES');
                } else {
                    project = results[0];
                    sql = 'UPDATE project SET ? WHERE id = ?';
                    return connection.promise().query(sql, [projectValues, projectId]);
                }
            })
            .then(() => {
                project = { ...project, ...projectValues};
                res.status(200).json(project);
            })
            .catch((err) => {
                if(err === 'NOT_EXISTING_RESOURCES'){
                    res.status(404).send(`Couldn't modify project #${projectId} resource, this resource doesn't exist!`);
                } else {
                    res.status(500).send(`Error server: ${err.message}`);
                }
            });
});

module.exports = router;