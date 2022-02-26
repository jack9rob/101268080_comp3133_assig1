var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')
var mongoose = require('mongoose')
const dotenv = require("dotenv");

// import models
const User = require('./models/User')
const Listing = require('./models/Listing')
const Booking = require('./models/Booking')

// graphQL schema
var gqlSchema = buildSchema(
    ` 
    type User {
        _id: ID
        username: String!
        firstname: String!
        lastname: String!
        password: String!
        email: String!
        type: String!
    }
    type Listing {
        _id: ID
        listing_id: String
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
        booking_id: String
        booking_date: String
        booking_start: String
        booking_end: String
        username: String
    }
    type Query {
        getUsers: [User]
        getListings: [Listing]
        getListingByTitle(title: String!): [Listing]
        getListingByCity(city: String!): [Listing]
        getListingByPostalCode(postalCode: String!): [Listing]
        login(username: String!, password: String!): User
        getBookingsByUser(username: String!): [Booking]
        getListingsByAdmin(username: String!): [Listing]
    }
    type Mutation {
        createUser(username: String, firstname: String, lastname: String, password: String, email: String, type: String): User
        createListing(listing_id: String, listing_title: String, description: String, street: String, city: String, postal_code: String, price: Float, email: String, username: String): Listing
        createBooking(listing_id: String, booking_id: String, booking_date: String, booking_start: String, booking_end: String, username: String): Booking
    }`
)

// root resolver
var rootResolver = {
    async login({username, password}) {
        const user = await User.findOne({username, username})
        if(user) {
            if(user.password == password) {
                return user
            }
        }
        return null
    },
    async createUser({username, firstname, lastname, password, email, type}) {
        const newUser = new User({username, firstname, lastname, password, email, type})
        const createdUser = await newUser.save()
        return createdUser
    },
    async createListing({listing_id, listing_title, description, street, city, postal_code, price, email, username}) {
        const userExists = await User.findOne({username: username})
        if(userExists && userExists.type == 'admin'){
            const newListing = new Listing({listing_id, listing_title, description, street, city, postal_code, price, email, username})
            const createdListing = await newListing.save()
            return createdListing
        }
        console.log('admin not found')
        return null

    },
    async createBooking({listing_id, booking_id, booking_date, booking_start, booking_end, username}) {
        const listingExist = await Listing.findOne({listing_id: listing_id})
        const userExists = await User.findOne({username: username})
        if(listingExist && userExists) {
            const newBooking = new Booking({listing_id, booking_id, booking_date, booking_start, booking_end, username})
            const createBooking = await newBooking.save()
            return createBooking
        }
        return null
    },
    async getListingByTitle({title}) {
        const listings = await Listing.find({listing_title: title })
        if(listings.length != 0) {
            return listings
        }
        return null
    },
    async getListingByCity({city}) {
        const listings = await Listing.find({city: city })
        if(listings.length != 0) {
            return listings
        }
        return null
    },
    async getListingByPostalCode({postalCode}) {
        const listings = await Listing.find({postal_code: postalCode })
        if(listings.length != 0) {
            return listings
        }
        return null
    },
    async getListings() {
        const listings = await Listing.find()
        return listings
    },
    async getBookingsByUser({username}) {
        const userExists = await User.findOne({username: username})
        if(userExists) {
            const bookings = await Booking.find({username: username}) 
            return bookings
        }
        return null
    },
    async getListingsByAdmin({username}) {
        const userExists = await User.findOne({username: username})
        if(userExists && userExists.type == 'admin') {
            const listings = await Listing.find({username: username}) 
            return listings
        }
        return null
    }

}

// define endpoints and server
var app = express()
app.use('/graphql', graphqlHTTP({
    schema: gqlSchema, 
    rootValue: rootResolver,
    graphiql: true
}))

dotenv.config();

// connect to MongoDB database
const dbURI = process.env.MONGO_DB;
mongoose
  .connect(dbURI)
  .then(() => console.log(`Database connection successful`))
  .catch((err) => console.log(`Database connection error ${err}`));

// start server
app.listen(4000, () => {
    console.log('Express GraphQl Server Running on http://localhost:4000/graphql')
})