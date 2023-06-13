const express = require('express')
const session = require('express-session')
const cors = require("cors");
var   MySQLStore = require('express-mysql-session')(session);

const config = require('./config.json')
const PORT = 80

//APP SETUP
const app = express()
const age = 1000 * 60 * 60 * 48;

//MYSQL
const db = require('./mysql')

//DISCORD BCS I HAVE LIMTED SPACE ON MY MSQL // DISCORD JS 13
const { Client, Intents} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(config.discord_bot);
client.channels.fetch(config.channel)

module.exports = {
    client : client,
}

let sessionStore = new MySQLStore({}, db);

const sessionMiddleware = session({
    secret: config.secret,
    saveUninitialized:true,
    cookie: { maxAge: age },
    resave: false,
    store: sessionStore,
})
app.use(express.json({ limit: '25mb' }));

app.use(cors({
    origin: config.your_domain
}));
app.use(sessionMiddleware)
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))
app.use(express.static(__dirname + '/public'))

app.listen(PORT , function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
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

const adminRoute = require("./routes/admin")
app.use('/admin',adminRoute)