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
var League = require('./models/League')
var Organization = require('./models/Organization')

mongoose.Promise = Promise

app.get('/', (req, res) => {
    res.send("hello world")
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("hello world")
})

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id
    var posts = await Post.find({ author })
    res.send(posts)
})

app.post('/post', auth.checkAuthentication, (req, res) => {
    var postData = req.body
    postData.author = req.userId
    var post = new Post(postData)
    post.save((err, result) => {
        if (err) {
            return res.status(500).send({ message: 'saving post error' })
        }
        res.sendStatus(200);
    })
})

app.get('/users', async (req, res) => {
    try {
        var users = await User.find({}, '-password -__v')
        res.send(users)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/deleteUser/:id', async (req, res) => {
    try {
        console.log("delete request")
        console.log()
        var user = User.findByIdAndRemove(req.params.id)
        console.log("deleted")
        res.status(200).send({ message: 'delete success' });
    } catch (error) {
        res.status(500).send({ message: 'delete error' });
    }
})

app.get('/profile/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id, '-password -__v')
        res.send(user)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/registerTeam', auth.checkAuthentication, (req, res) => {
    console.log(req)
    var teamData = req.body
    teamData.author = req.userId
    console.log(teamData)
    var team = new Team(teamData)
    console.log(team)
    Team.findOneAndUpdate({ 'name': teamData.name }, teamData, function (err, success) {
        if (!success) {
            console.log('adding team to mongo')
            team.save((err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'saving team error' })
                }
                res.status(200).send({ message: 'team register success' })
            })
        }
    })
})


app.get('/teamNames', async (req, res) => {
    try {
        var teams = await Team.find({}, 'name')
        res.send(teams)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/teams', async (req, res) => {
    try {
        var teams = await Team.find({})
        res.send(teams)

    } catch (error) {
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

    TeamDivisions.findOneAndUpdate({ 'leagueName': teamDivisions.leagueName }, teamDivisions, function (err, success) {
        if (!success) {
            console.log('adding team divisions info to mongo')
            divisions.save((err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'saving team divisions info error' })
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

    } catch (error) {
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
        if (err) {
            console.log('error')
            return res.status(500).send({ message: 'saving score error' })
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

    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/saveLeague', auth.checkAuthentication, (req, res) => {
    console.log('save League')
    console.log(req.body)
    var league = new League(req.body)
    console.log('league model created')
    console.log(league)

    League.findOneAndUpdate({ 'name': req.body.name }, req.body, function (err, success) {
        if (!success) {
            console.log('adding League to mongo')
            league.save((err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'saving League error' })
                }
                res.status(200).send({ message: 'create success' })
            })
        }
        else {
            console.log("existing league")
            res.status(200).send({ message: 'update success' });
        }
    })
})

app.get('/getLeagues', async (req, res) => {
    try {
        var leagues = await League.find({})
        console.log(leagues)
        res.send(leagues)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/deleteLeague/:id', async (req, res) => {
    try {
        console.log("delete request")
        var league = await League.findByIdAndRemove(req.params.id)
        console.log("deleted")
        res.status(200).send({ message: 'delete success' });
    } catch (error) {
        res.status(500).send({ message: 'delete error' });
    }
})

app.post('/organizations', auth.checkAuthentication, (req, res) => {
    console.log('save Org')
    console.log(req.body)
    var organization = new Organization(req.body)
    console.log('Org model created')
    console.log(organization)

    Organization.findOneAndUpdate({ 'name': req.body.name }, req.body, function (err, success) {
        if (!success) {
            console.log('adding organization to mongo')
            organization.save((err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'saving organization error' })
                }
                res.status(200).send({ message: 'create success' })
            })
        }
        else {
            console.log("existing organization")
            res.status(200).send({ message: 'update success' });
        }
    })
})

app.get('/organizations', async (req, res) => {
    try {
        console.log("hello")
        console.log(req.body)
        var organizations = await Organization.find({})
        console.log(organizations)
        res.send(organizations)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/organizations/user/:id', async (req, res) => {
    try {
        console.log("hello")
        console.log(req.params.id)
        var organizations = await Organization.find({ user_id: req.params.id})
        console.log(organizations)
        res.send(organizations)

    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/organizations/:id', async (req, res) => {
    try {
        console.log("org retrieve by Id")
        console.log(req.params.id)
        var organization = await Organization.findById(req.params.id)
        console.log("retrieve by Id")
        //console.log(organization)
        res.status(200).send(organization);
    } catch (error) {
        res.status(500).send({ message: 'retrieve by Id error' });
    }
})

// mongoose.connect('mongodb://localhost:27017/psocial', (err) => {
//     if(!err) {
//         console.log('connected to mongo')
//     }
// })

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/leagueSiteBackend", { useCreateIndex: true, useNewUrlParser: true });

app.use('/auth', auth.router)

//app.listen('8080')

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
