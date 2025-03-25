const User = require('./User');
const Message = require('./Message');

// Define associations
Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
});

Message.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'recipient'
});

User.hasMany(Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});

User.hasMany(Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
});

module.exports = { User, Message }; 