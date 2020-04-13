var bcrypt = require('bcrypt-nodejs')
var jwt = require('jwt-simple')
var User = require('./models/User')
var express = require('express')
var router = express.Router()

router.post('/register', (req, res) => {
    var userData = req.body;
    console.log(userData)
    var user = new User(userData);
    console.log(user)
    User.findOne({ 'email': req.body.email }, req.body, function (err, success) {
        console.log(success)
        if (!success) {
            user.save((err, newUser) => {
                if (err)
                    return res.status(500).send({ message: "Error saving user" })

                var payload = { sub: user._id }
                var token = jwt.encode(payload, '123')
                return res.status(200).send({ token : token, id : user._id, name: user.name })
            })
        }
    })
})

router.post('/login', async (req, res) => {
    var loginData = req.body;
    var user = await User.findOne({ email: loginData.email })

    if (!user)
        return res.status(401).send({ message: 'Email or Password is invalid' })

    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch) {
            return res.status(401).send({ message: 'Email or Password is invalid' })
        }

        var payload = { sub: user._id }
        var token = jwt.encode(payload, '123')
        return res.status(200).send({ token : token, id : user._id, name: user.name  })
    })

})

var auth = {
    router,
    checkAuthentication: (req, res, next) => {
        if (!req.header('Authorization'))
            res.status(401).send({ message: 'Unauthorized user. Missing Auth header' })

        console.log(req)
        var token = req.header('Authorization').split(' ')[1]
        var payload = jwt.decode(token, '123')
        if (!payload)
            res.status(401).send({ message: 'Unauthorized user. Auth Token invalid' })

        req.userId = payload.sub

        next()

    }
}

module.exports = auth