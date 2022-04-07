var { buildSchema } = require('graphql')

exports.typeDefs = buildSchema(` 
    type User {
        _id: ID
        username: String!
        firstname: String!
        lastname: String!
        password: String!
        email: String!
        type: String
    }
    type Listing {
        _id: ID
        listing_title: String
        description: String
        street: String
        city: String
        postal_code: String
        price: Float
        email: String
        username: String
    }
    type Booking {
        _id: ID
        listing_id: String
        booking_date: String
        booking_start: String
        booking_end: String
        username: String
    }
    type Query {
        getUsers: [User]
        getListings: [Listing]
        getListingById(id: String): Listing
        getListingByTitle(title: String!): [Listing]
        getListingByCity(city: String!): [Listing]
        getListingByPostalCode(postalCode: String!): [Listing]
        getBookingsByUser(username: String!): [Booking]
        getListingsByAdmin(username: String!): [Listing]
        login(username: String!, password: String!): String
        getCurrentUser: String
    }
    type Mutation {
        createUser(username: String, firstname: String, lastname: String, password: String, email: String, type: String): User
        createListing(listing_title: String, description: String, street: String, city: String, postal_code: String, price: Float, email: String, username: String): Listing
        createBooking(listing_id: String, booking_date: String, booking_start: String, booking_end: String, username: String): Booking
    }
    `
)