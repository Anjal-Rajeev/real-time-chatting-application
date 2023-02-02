const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    userName:{
        type : String,
        required : true
    },
    password:{ 
        type : String,
        required : true
    },
    dp:{
        type : String
    },
    mutedUsers:{
        type : Array
    },
    blockedUsers:{
        type : Array
    }
})

var userModel = mongoose.model('users', userSchema)
module.exports = userModel