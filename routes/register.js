const router = require("express").Router();
const checkAuthFields = require("../middlewares/check-fields");
const Admin = require("../models/admin");

router.post("/", checkAuthFields, (req, res) => {
	const { email, password } = req.body;
    Admin.hashPassword(password)
      .then((hashedPassword) => Admin.create(email, hashedPassword))
	  .then((admin) => {
			res.status(201).json(admin);
	  })
	  .catch((err) => {
	    res
	      .status(500)
	      .send({ message: `Error registering new user: ${err.message} ` });
	  });
});

module.exports = router;