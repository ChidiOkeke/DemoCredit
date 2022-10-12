
require('dotenv').config()

const DB_USERNAME = process.env.DATABASE_USER;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_NAME = process.env.DATABASE_NAME;
const DB_HOST = process.env.DATABASE_HOST;

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: DB_HOST,
      port: 3306,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'mysql2',
    connection: {
      host: DB_HOST,
      port: 3306,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }

};