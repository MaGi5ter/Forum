const express = require('express')
const session = require('express-session')

const config = require('./config.json')
const PORT = 40387

//APP SETUP
const app = express()
const oneHour = 1000 * 60 * 60;

const sessionMiddleware = session({
    secret: config.secret,
    saveUninitialized:true,
    cookie: { maxAge: oneHour },
    resave: false,
})

app.use(sessionMiddleware)
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))
app.use(express.static(__dirname + '/public'))

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

//MYSQL
const db = require('./mysql')

//ROUTES
const mainRoute = require("./routes/main")
app.use('/',mainRoute)

const loginRoute = require("./routes/login")
app.use('/login',loginRoute)

const authRoute = require("./routes/auth")
app.use('/auth',authRoute)
