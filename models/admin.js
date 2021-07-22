const connection = require("../db-config");
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

const verifyPassword = (plainPassword, hashedpassword) => {
    return argon2.verify(hashedpassword, plainPassword, hashOptions);
}

const create = (email, hashedpassword) => {
	const sql = "INSERT INTO admin (email, password) VALUES (?,?)";
	return connection
		.promise()
		.query(sql, [email, hashedpassword])
		.then(([{insertId}]) => ({ id: insertId, email }));
};

const findByEmail = (email) => {
    const sql = "SELECT * FROM admin WHERE email = ?";
    return connection
        .promise()
        .query(sql, [email])
        .then(([results]) => results[0]);
}

module.exports = {
	create,
    findByEmail,
	hashPassword,
    verifyPassword,
};