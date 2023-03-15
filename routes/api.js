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
        else if(req.params.type == 'comments') {

            //it will respond with selected post comments

            let post = req.query.post
            if(post == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM comments WHERE postID = ? AND replyID IS NULL ORDER BY createdAt DESC LIMIT 50`
                let sql_parm = [post]

                let post_comment = await dbquery(sql,sql_parm)

                res.send(post_comment)
            }
        }
        else if(req.params.type == 'replies') {

            //it will respond with selected post comments

            let comment = req.query.comment
            if(comment == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM comments WHERE replyID = ? ORDER BY createdAt DESC LIMIT 50`
                let sql_parm = [comment]

                let comment_replies = await dbquery(sql,sql_parm)

                res.send(comment_replies)
            }
        }
        else res.send({some: 'nothing'})

    })
    .post(async (req,res) => {
        if(req.params.type = "comment") {
            if(req.session.loggedIn == true) {

                data = req.body
                console.log(data)

                let post = await dbquery(`SELECT * FROM posts WHERE id = ?`,[data.postID])

                console.log(post)

                if(data.content == '' || data.content == undefined ) res.send('EMPTY CONTENT')
                else if(post.length == 0) res.send('THIS POST DONT EXIST')
                else {

                    if(data.reply != null) {
                        let comment = await dbquery(`SELECT * FROM comments WHERE id = ?`,[data.reply])

                        console.log(comment)

                        if(comment.length == 0) {
                            res.send('THIS COMMENT DOES NOT EXITS')
                            return
                        }

                    }
    
                    let userID = await dbquery(`SELECT ID FROM users WHERE token = ?`,[req.session.token[0].token])
                    userID = userID[0].ID
                    console.log(userID)
    
                    let sql = `INSERT INTO comments (id, authorID,author,               content,      createdAt, replyID,     postID) VALUES (NULL, ? ,? , ?, ?, ?,?);`
                    let sql_parm =                      [userID , req.session.username, data.content, Date.now() ,data.reply, data.postID]
                    
                    console.log(await dbquery(sql,sql_parm))

                    res.send('COMMENT ADDED')

                }
            }
            else res.send('verification failed')
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