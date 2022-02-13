const mongoose = require('mongoose')

const ListingSchema = mongoose.Schema(
    {
        listing_id: {
            type: String,
            required: true
        },
        listing_title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postal_code: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        email: {
            // valid email format
            type: String,
            required: true
        },
        username: {
            // admins user name, foreign, dont think this works
            //type: mongoose.Schema.Types.ObjectId,
            //ref: 'User'
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model("Listing", ListingSchema)