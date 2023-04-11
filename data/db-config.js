const knexConfig = require("../knexfile");

const knex = require("knex");
const { NODE_ENV } = require("../config/config");

module.exports = knex(knexConfig[NODE_ENV]);
