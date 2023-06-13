require('dotenv').config()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const sha256 = require('sha256')

async function checkAvailability(email, name) {
    const {Client} =require('pg')
    let client = new Client()   
    await client.connect();
    const query = `SELECT COUNT(*) AS count FROM profile WHERE email = $1 OR name = $2;`;
    const values = [email, name];
    const result = await client.query(query, values);
    const count = parseInt(result.rows[0].count);
  
    await client.end();
  
    return count > 0;
}

function isOnlySpaces(value) {
    return value.trim() === '';
  }

router
    .route("/")
    .post(async (req,res) => {
        let password = sha256(req.body.password)
        let username = req.body.username
        let email = req.body.email 

        if(!username || !password || !email) {
            res.sendStatus(400) 
            return
        }

        if(isOnlySpaces(username) || isOnlySpaces(email)) {
            res.sendStatus(400) 
            return
        }

        if(await checkAvailability(email,username)) {
           res.send({
            error:'email or username is already used',
            created: false,
            token:''
           })
           return
        }

        if(username.length < 3) {
            res.json({
                error:'name needs to be atleast 3 letters',
                created: false,
                token:''
            })
            return
        }

        if(username.includes(' ')) {
            res.send({
                error:'username cannot include spaces',
                created: false,
                token:'' 
            })
            return
        }

        const { Client } = require('pg')
        let client = new Client()
        await client.connect()

        const query = `INSERT INTO profile (password, email, name) VALUES ($1, $2, $3) RETURNING id ;`
        const values = [password,email,username]
        const result = await client.query(query, values);
        const insertedId = result.rows[0].id;

        data = {
            uid:insertedId
        }

        const accessToken = jwt.sign(data,`${process.env.ACCESS_TOKEN_SECRET}${password}`)
        res.json({
            error:'',
            created: true,
            token:accessToken 
        })

        await client.end()
    })

module.exports = router