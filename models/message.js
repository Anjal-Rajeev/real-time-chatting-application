const mongoose = require('mongoose')

const msgSchema = mongoose.Schema({
    room: {
        type: String
    },
    messages: [{
        msg: String,
        sender: String,
        receiver: String
    }]
})

var messageModel = mongoose.model('message',msgSchema)
module.exports = messageModel