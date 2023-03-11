//my first ever try to make some pseudo api

const express = require('express')
const router = express.Router()
let db = require('../mysql')  

// Since the hyphen (-) and the dot (.) are interpreted literally,
// they can be used along with route parameters for useful purposes.

router
    .route("/:username")
    .get(async (req,res) => {

        if(req.params.type == 'posts') {

            //https://discord.com/api/v9/channels/684116498070896721/messages?before=1082416576982155335&limit=50
            let before = req.query.before

            console.log(Date.now())
            
            if(before == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM posts WHERE createdtimestamp < '${req.query.before}' ORDER BY createdtimestamp DESC LIMIT 50`
                res.send(await dbquery(sql))
            }

        }
        else res.send({some: 'nothing'})

    })

module.exports = router


function dbquery(prompt) {
    return new Promise((resolve,reject) => {
        db.query(prompt, function (err,rows){
           if(err) reject(err)
           else resolve(rows)
        })
    })
}