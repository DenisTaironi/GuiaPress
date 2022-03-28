const Sequelize = require("sequelize");
const connection = new Sequelize("GuiaPress", "root", "ufc2021", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00",
});
module.exports = connection;