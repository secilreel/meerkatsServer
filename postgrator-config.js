'use strict';
require('dotenv').config();

module.exports = {
  'migrationDirectory': 'migrations',
  'driver': 'pg',
  'host': process.env.MIGRATION_DB_HOST,
  'port': process.env.MIGRATION_DB_PORT || 5432,
  'database': process.env.MIGRATION_DB_NAME,
  'username': process.env.MIGRATION_DB_USER,
};
