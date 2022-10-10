const DB_USERNAME = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_NAME = process.env.DATABASE_NAME;

// console.log(DB_USERNAME)

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 's^c*5&F86rSQ',
      database: 'demo_credit'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }

};



// import Knex from 'knex'

// const DATABASE_USER = process.env.DATABASE_USER;
// const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
// const DATABASE_NAME = process.env.DATABASE_NAME;

// const knex = Knex({
//   client: 'mysql',
//   connection: {
//     host: 'localhost',
//     port: 3306,
//     user: DATABASE_USER,
//     password: DATABASE_PASSWORD,
//     database: 'DBLab'
//   }
// })


// export const const = knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: 'localhost',
//     port: 3306,
//     user: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_NAME
//   }
// });
