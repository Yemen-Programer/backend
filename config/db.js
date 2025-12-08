// config/db.js
const { Sequelize } = require("sequelize");
const connectionString = "postgresql://postgres.jainmbpuplpauoboaswz:Z8L6k0XpeSRpG8qt@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3
  }
});

module.exports = sequelize;