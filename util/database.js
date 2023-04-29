require("dotenv").config();
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(db_name, db_user, db_password, {
	dialect: "mysql",
	host: db_host,
});

module.exports = sequelize;
