const express = require('express')
const session = require('express-session')
const cors = require("cors");
var   MySQLStore = require('express-mysql-session')(session);

const config = require('./config.json')
const PORT = 40387

//APP SETUP
const app = express()
const age = 1000 * 60 * 60 * 6;

//MYSQL
const db = require('./mysql')

let sessionStore = new MySQLStore({}, db);

const sessionMiddleware = session({
    secret: config.secret,
    saveUninitialized:true,
    cookie: { maxAge: age },
    resave: false,
    store: sessionStore,
})

app.use(cors({
    origin: config.your_domain
}));
app.use(sessionMiddleware)
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))
app.use(express.static(__dirname + '/public'))

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});


//ROUTES
const mainRoute = require("./routes/main")
app.use('/',mainRoute)

const loginRoute = require("./routes/login")
app.use('/login',loginRoute)

const authRoute = require("./routes/auth")
app.use('/auth',authRoute)

const createpostRoute = require("./routes/create_post")
app.use('/create_post',createpostRoute)

const apiRoute = require("./routes/api")
app.use('/api',apiRoute)

const userRoute = require("./routes/user")
app.use('/user',userRoute)

const postRoute = require("./routes/post")
app.use('/post',postRoute)