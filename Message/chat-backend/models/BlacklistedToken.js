const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BlacklistedToken = sequelize.define('BlacklistedToken', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = BlacklistedToken; 