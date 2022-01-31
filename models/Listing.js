const mongoose = require('mongoose')

const ListingSchema = mongoose.Schema(
    {
        listing_id: {

        },
        listing_title: {

        },
        description: {

        },
        street: {

        },
        city: {

        },
        postal_code: {

        },
        price: {

        },
        email: {

        },
        username: {

        }
    }
)

module.exports = mongoose.model("Listing", ListingSchema)