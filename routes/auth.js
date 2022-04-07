const router = require('express').Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const User = require('../models/User')

router.post("/login", (req, res) => {
    console.log(req.body)
    const userLoggingIn = req.body
    
    User.findOne({username: userLoggingIn.username})
    .then(dbUser => {
        if(!dbUser) {
            console.log('user not found...')
            return res.json({message: 'invalid username or password, not found', status:500})
        }
        bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
            if(isCorrect) {
                // create token
                const payload = {
                    id: dbUser._id,
                    username: dbUser.username
                }
                token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400},
                    (err, token) => {
                        if(err){
                            console.log(err)
                            return res.json({message: err})
                            
                        }
                        console.log('token created')
                        return res.json({
                            status: 'ok',
                            token: token
                        })
                    }
                )
            } else {
                console.log('password incorrect...')
                return res.json({
                    message: 'invalid username or password 2',
                    status:500
                })
            }
        })
    })
})

// get current uer
router.get('/getUsername', verifyJWT, (req, res) => {
    res.json({user: req.user, isLoggedIn: true})
})

// verify user, check if logged in
function verifyJWT(req, res, next) {
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) return res.json({
                isLoggedIn: false,
                message: 'failed to authenticate'
            })
            let dbUser = await User.findById(decoded.id)
            dbUser.isLoggedIn = true
            req.user = dbUser
            return next()
        })
    } else {
        res.json({message: 'incorrect token given', isLoggedIn: false})
    }
}

module.exports = router;