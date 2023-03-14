//my first ever try to make some pseudo api

const express = require('express')
const router = express.Router()
let db = require('../mysql')  

// Since the hyphen (-) and the dot (.) are interpreted literally,
// they can be used along with route parameters for useful purposes.

router
    .route("/:type")
    .get(async (req,res) => {

        if(req.params.type == 'posts') {

            //it responds with data of latest posts, used for main page "/"

            //https://discord.com/api/v9/channels/684116498070896721/messages?before=1082416576982155335&limit=50
            
            let before = req.query.before

            console.log(Date.now())
            
            if(before == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM posts WHERE createdtimestamp < ? ORDER BY createdtimestamp DESC LIMIT 50`
                let sql_parm = [req.query.before]
                res.send(await dbquery(sql , sql_parm))
            }

        }
        else if(req.params.type == 'activity') {

            //it will respond with selected user every activity

            let author = req.query.user
            if(author == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM posts WHERE author = ? ORDER BY createdtimestamp DESC LIMIT 50`
                let sql_parm = [author]

                let user_activity = await dbquery(sql,sql_parm)

                res.send(user_activity)
            }
        }
        else res.send({some: 'nothing'})

    })
    .post(async (req,res) => {
        if(req.params.type = "comment") {
            console.log('herhe')
            console.log(req)
            console.log(req.body)


        }
    })

module.exports = router


function dbquery(prompt,variables) {
    return new Promise((resolve,reject) => {
        db.query(prompt,variables, function (err,rows){
           if(err) reject(err)
           else resolve(rows)
        })
    })
}