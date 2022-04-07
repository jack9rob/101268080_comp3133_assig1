var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')
var mongoose = require('mongoose')
const dotenv = require("dotenv");
const bodyParser = require('body-parser')
const cors = require("cors");

// graphQL schema and resolvers
const schemas = require('./schema').typeDefs
const resolvers = require('./resolvers').resolvers

// import authentication routes, jwt
const auth = require('./routes/auth')

// use env 
dotenv.config()

// mongodb connection sttring
const dbURI = process.env.MONGO_DB;

// define express server
var app = express()

app.use(cors())
app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema: schemas, 
    rootValue: resolvers,
    graphiql: true
}))

app.use(bodyParser.json())
app.use("/api/auth", auth)

// connect to MongoDB database
mongoose
  .connect(dbURI)
  .then(() => console.log(`Database connection successful`))
  .catch((err) => console.log(`Database connection error ${err}`));

// start server
app.listen(4000, () => {
    console.log('Express GraphQl Server Running on http://localhost:4000/graphql')
})