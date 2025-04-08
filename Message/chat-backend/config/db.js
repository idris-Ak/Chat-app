const { Sequelize } = require('sequelize');
require('dotenv').config();
const mysql = require('mysql2/promise');

// DEBUG: Force check what's loaded
console.log("🔍 ORIGINAL ENV USER:", process.env.DB_USER);

// 🛠 Temporarily force the env values (for debugging only!)
process.env.DB_USER = "ITBOOST_ADMIN";
process.env.DB_PASSWORD = "Pass123!";

console.log("🔧 FORCED DB_USER:", process.env.DB_USER);

// Function to create database if it doesn't exist
async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log("🐛 mysql2 connection.user =", connection.config.user);

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.end();

        console.log('✅ Database check/creation completed');
    } catch (error) {
        console.error('❌ Error creating database:', error);
        throw error;
    }
}

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = { sequelize, createDatabase };
