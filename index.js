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
        _id: ID!
        username: String!
        firstname: String
        lastname: String
        password: String
        email: String!
        type: String
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
        booking_date: Date
        booking_start: Date
        booking_end: Date
        username: String
    }
    type Query {
        getUsers: [User!]!
    }
    type Mutation {
        createUser(username: String, firstname: String, lastname: String, password: String, email: String, type: String): User
        createListing(listing_id: String, listing_title: String, description: String, street: String, city: String, postal_code: String, price: Float, email: String, username: String): Listing
        createBooking(listing_id: String, booking_id: String, bookding_date: Date, booking_start: Date, booking_end: Date, username: String): Booking
    }`
)

// root resolver
var rootResolver = {
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
            return creatingListing
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