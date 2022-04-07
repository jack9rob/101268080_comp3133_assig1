const User = require('./models/User')
const Booking = require('./models/Booking')
const Listing = require('./models/Listing')
const bcrypt = require('bcrypt')

exports.resolvers = {
    async createUser({username, firstname, lastname, password, email, type}) {
        const userExists = await User.findOne({username: username})
        if(!userExists) {
            hashPassword = await bcrypt.hash(password, 10)
            console.log(hashPassword)
            const newUser = new User({username, firstname, lastname, password: hashPassword, email, type})
            const createdUser = await newUser.save()
            return createdUser
        }
        return null
    },
    async createListing({listing_title, description, street, city, postal_code, price, email, username}) {
        const userExists = await User.findOne({username: username})
        if(userExists && userExists.type == 'admin'){
            const newListing = new Listing({listing_title, description, street, city, postal_code, price, email, username})
            const createdListing = await newListing.save()
            return createdListing
        }
        console.log('admin not found')
        return null

    },
    async createBooking({listing_id, booking_date, booking_start, booking_end, username}) {
        const listingExist = await Listing.findOne({_id: listing_id})
        const userExists = await User.findOne({username: username})
        if(listingExist && userExists) {
            const newBooking = new Booking({listing_id: listing_id, booking_date: booking_date, booking_start: booking_start, booking_end: booking_end, username: username})
            const createBooking = await newBooking.save()
            console.log('booked')
            return createBooking
        }
        return null
    },
    async getListingById({id}) {
        const listing = await Listing.findById(id)
        if(listing) {
            return listing
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
    },
}