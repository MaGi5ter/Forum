require('dotenv').config()

const express = require('express')
const app = express()
const server = require('http').createServer(app)

const cors = require('cors')
const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const wss = new WebSocket.WebSocketServer({server: server})

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    const { Client } = require('pg')
    let client = new Client()
    await client.connect()

    const decodedToken = jwt.decode(token);
    if(decodedToken == null) {
        res.sendStatus(401)
        return
    }
    let uid = decodedToken.uid

    const query = `SELECT password FROM profile WHERE id = $1;`
    const values = [uid]
    const result = await client.query(query, values);
    
    let password = result.rows[0].password
    client.end()

    //I VERIFY TOKENS USING SECRET SALT AND PASSWORD SO IF USER GIVE SOMEONE HIS TOKEN, HE WILL ONLY NEED TO CHANGE PASSWORD TO MAKE TOKEN INVALID
    jwt.verify(token , `${process.env.ACCESS_TOKEN_SECRET}${password}`, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const registerRoute = require("./api/register")
app.use('/api/register',registerRoute)

const loginRoute = require("./api/login")
app.use('/api/login',loginRoute)

app.use(authenticateToken)

const checkTokenRoute = require("./api/checkToken")
app.use('/api/checktoken',checkTokenRoute)

const searchUserRoute = require("./api/searchuser")
app.use('/api/searchuser',searchUserRoute)

wss.on('connection', (ws) => {
    console.log('connected')
    ws.send('connected')
})

server.listen(3000, () => console.log('STARTED'))