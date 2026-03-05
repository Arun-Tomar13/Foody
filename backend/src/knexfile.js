// import knex from 'knex'
// import dotenv from 'dotenv'

// dotenv.config()

// /**
//  * 
//  * */

// const knexfile=knex({
//    client: process.env.MYSQL_CLIENT,
//   connection: {
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     port:process.env.MYSQL_PORT
//   },
// })

// export default knexfile;

require("dotenv").config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    }
  }
};