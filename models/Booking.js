const mongoose = require('mongoose')

const BookingSchema = mongoose.Schema(
    {
        listing_id: {
            type: String,
            required: true
        },
        booking_date: {
            type: Date,
            required: true
        },
        booking_start: {
            type: Date,
            required: true
        },
        booking_end: {
            type: Date,
            required: true
        }, 
        username: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model("Booking", BookingSchema)