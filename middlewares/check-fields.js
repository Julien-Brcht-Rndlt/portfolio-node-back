const checkAuthFields = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(422).json({ errorMessage: "missing fields" });
	}
	return next();
};

module.exports = checkAuthFields;