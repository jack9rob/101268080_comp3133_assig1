const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        firstname: {
            type: String,
            required: true
        }, 
        lastname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }, 
        email: {
            type: String,
            unique: true,
            required: true
        }, 
        type: {
            type: String,
            default: 'customer',
            enum: ['customer', 'admin'],
            required: true
        }
    }
)

module.exports = mongoose.model('User', UserSchema)