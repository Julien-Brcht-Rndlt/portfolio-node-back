const db = require("../db-config");
const argon2 = require("argon2");

const hashOptions = {
	type: argon2.argon2i,
	memoryCost: 2 ** 16,
	timeCost: 5,
	parallelism: 1,
};

const hashPassword = (plainPassword) => {
	return argon2.hash(plainPassword, hashOptions);
};

const create = (email, hashedpassword) => {
	const sql = "INSERT INTO admin (email, password) VALUES (?,?)";
	return db
		.promise()
		.query(sql, [email, hashedpassword])
		.then(([{insertId}]) => ({ id: insertId, email }));
};

module.exports = {
	create,
	hashPassword,
};