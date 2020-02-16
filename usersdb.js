const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        
    },
    password: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true
        
    },
    confirmed: {
        type: Boolean,
        defaultValue: false
    }
})

module.exports = mongoose.model('users', userSchema)