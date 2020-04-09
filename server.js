var express = require('express')
var app = new express()
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var User = require('./models/User')
var Post = require('./models/Post')
var Team = require('./models/Team')
var TeamDivisions = require('./models/TeamDivisions')
var Score = require('./models/Score')
var auth = require('./auth')

mongoose.Promise = Promise

app.get('/', (req, res) => {
    res.send("hello world")
})

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("hello world")
})

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts)
})

app.post('/post', auth.checkAuthentication, (req, res) => {
    var postData = req.body
    postData.author = req.userId
    var post = new Post(postData)
    post.save((err, result) => {
        if(err) {
            return res.status(500).send({message: 'saving post error'})
        }
        res.sendStatus(200);
    })
})

app.get('/users', async (req, res) => {
    try {
        var users = await User.find({}, '-password -__v')
        res.send(users)

    } catch(error) {
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id, '-password -__v')
        res.send(user)
    } catch(error) {
        res.sendStatus(500)
    }
})

app.post('/registerTeam', auth.checkAuthentication, (req, res) => {
    var teamData = req.body
    teamData.author = req.userId
    console.log(teamData)
    var team = new Team(teamData)
    console.log(team)
    Team.findOneAndUpdate({'name': teamData.name}, teamData ,function(err, success) {
        if(!success) {
            console.log('adding team to mongo')
            team.save((err, result) => {
                if(err) {
                    return res.status(500).send({message: 'saving team error'})
                }
                res.sendStatus(200);
            })
        }
    })
})


app.get('/teamNames', async (req, res) => {
    try {
        var teams = await Team.find({}, 'name')
        res.send(teams)

    } catch(error) {
        res.sendStatus(500)
    }
})

app.post('/registerDivisions', auth.checkAuthentication, (req, res) => {
    var teamDivisions = req.body
    //teamDivisions.author = req.userId
    console.log(teamDivisions)
    var divisions = new TeamDivisions(teamDivisions)
    console.log('model created')
    console.log(divisions)

    TeamDivisions.findOneAndUpdate({'leagueName': teamDivisions.leagueName}, teamDivisions ,function(err, success) {
        if(!success) {
            console.log('adding team divisions info to mongo')
            divisions.save((err, result) => {
                if(err) {
                    return res.status(500).send({message: 'saving team divisions info error'})
                }
                res.sendStatus(200);
            })
        }
    })
})

app.get('/leagueDivisions', async (req, res) => {
    try {
        var divisions = await TeamDivisions.findOne({}, 'divisions')
        res.send(divisions)

    } catch(error) {
        res.sendStatus(500)
    }
})

app.post('/saveScore', auth.checkAuthentication, (req, res) => {
    console.log('save score')
    console.log(req.body)
    var score = new Score(req.body)
    console.log('score model created')
    console.log(score)

    score.save((err, result) => {
        if(err) {
            console.log('error')
            return res.status(500).send({message: 'saving score error'})
        }
        console.log('success')
        res.sendStatus(200);
    })
})

app.get('/getScores', async (req, res) => {
    try {
        var scores = await Score.find({})
        console.log(scores)
        res.send(scores)

    } catch(error) {
        res.sendStatus(500)
    }
})

mongoose.connect('mongodb://localhost:27017/psocial', (err) => {
    if(!err) {
        console.log('connected to mongo')
    }
})

app.use('/auth', auth.router)
app.listen('8080')