require('dotenv').config()

const express = require('express')
const router = express.Router()

router
    .route("/")
    .post(async (req,res) => {
        let SearchValue = req.body.search

        if(!SearchValue){
            res.sendStatus(400)
            return
        }
        
        if(SearchValue.length < 3) {
            res.json([])
            return
        }

        const { Client } = require('pg')
        let client = new Client()
        await client.connect()

        const query = `SELECT * FROM profile WHERE name ILIKE '%' || $1 || '%';`
        const values = [SearchValue]
        const result = await client.query(query, values);
       
        console.log(result.rows)

        if(result.rowCount == 0) {
            res.json([])
            return
        }
        else {
            let data = []

            result.rows.forEach((result,index) => {
                data.push({
                    uid:result.id,
                    u_name:result.name
                })

                
            });

            res.json(data)
        }

        await client.end()
    })

module.exports = router