require('dotenv').config()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const sha256 = require('sha256')

router
    .route("/")
    .post(async (req,res) => {
        let password = sha256(req.body.password)
        let username = req.body.username

        if(!username) {
            res.sendStatus(400) 
            return
        }

        const { Client } = require('pg')
        let client = new Client()
        await client.connect()

        const query = `SELECT password, id FROM profile WHERE name = $1 AND password = $2;`
        const values = [username,password]
        const result = await client.query(query, values);

        if(result.rows.length > 0) {
            let resultData = result.rows[0]

            let password = resultData.password

            data = {
                uid:resultData.id
            }

            const accessToken = jwt.sign(data,`${process.env.ACCESS_TOKEN_SECRET}${password}`)
            res.json({
                token:accessToken 
            })
        }else {
            res.json({
                error:'Bad Login Data'
            })
        }

        await client.end()
    })

module.exports = router