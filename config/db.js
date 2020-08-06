const mongoose =require('mongoose');
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/CJFriendsSuggestor");
autoIncrement.initialize(connection);

module.exports = {
    database : 'mongodb://localhost/CJFriendsSuggestor',
    connection: connection
}