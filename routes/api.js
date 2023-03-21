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
                let sql = `SELECT * FROM posts WHERE createdAt < ? ORDER BY createdAt DESC LIMIT 50`
                let sql_parm = [req.query.before]

                if(req.session.loggedIn == true) {

                    let posts = await dbquery(sql , sql_parm)
                    let posts_id = []

                    for (let index = 0; index < posts.length; index++) {
                        const element = posts[index];

                        posts_id.push(element.id)
                    }

                    let sql1 = `SELECT post,type,up_down FROM votes WHERE post in (${posts_id.toString()}) AND user = ?;`
                    let sql1_param = [req.session.username]

                    let votes = await dbquery(sql1,sql1_param)

                    // console.log(votes)

                    res.send([posts,votes])


                } else {
                    res.send([await dbquery(sql , sql_parm)])
                }
            }

        }
        else if(req.params.type == 'activity') {

            //it will respond with selected user every activity

            let author = req.query.user
            if(author == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM posts WHERE author = ? ORDER BY createdAt DESC LIMIT 50`
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
        else if(req.params.type == 'usercomments') {

            //it will respond with selected post comments

            let user_overview = req.query.user
            if(user_overview == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM comments WHERE author = ? ORDER BY createdAt DESC LIMIT 50`
                let sql_parm = [user_overview]

                let user_comments = await dbquery(sql,sql_parm)

                res.send(user_comments)
            }
        }
        else if(req.params.type == 'post_data') {

            //it will respond with selected post comments

            let post_id = req.query.id
            if(post_id == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM posts WHERE id = ? LIMIT 50`
                let sql_parm = [post_id]

                let post_data = await dbquery(sql,sql_parm)

                res.send(post_data)
            }
        }
        else res.send({some: 'nothing'})

    })
    .post(async (req,res) => {
        if(req.params.type == "comment") {
            if(req.session.loggedIn == true) {

                data = req.body
                console.log(data)

                let post = await dbquery(`SELECT * FROM posts WHERE id = ?`,[data.postID])

                console.log(post)

                if(data.content == '' || data.content == undefined ) res.send('EMPTY CONTENT')
                else if(data.content.length > 5000) res.send('Meassage too long')
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
        else if(req.params.type == 'vote') {
            if(req.session.loggedIn == true) {

                console.log(req.session)

                //it will respond with selected post comments
                let vote = req.body.vote
                let post = req.body.postID
                let type = req.body.type // p - posts ; c - comment

                if(vote == undefined || post == undefined || type == undefined) res.send('not full data')
                else if(vote != -1 && vote != 1) res.send('bad vote')
                else if(type != 'p' && type != 'c') res.send('bad type')
                else {

                    let username = req.session.username
                    let repair = 0 //used when sb change his mind

                    let votes = await dbquery('SELECT * FROM votes WHERE user = ? AND post = ? AND type = ?',[username,post,type])
                    if(votes.length > 0) {
                        if(votes[0].up_down == vote) {
                            res.send('alredy voted')
                            return 
                        }else {
                            let sql = `DELETE FROM votes WHERE user = ? AND post = ? AND type = ?`
                            let sql_parm = [username,post,type]

                            repair = repair + vote

                            console.log(repair)
                            
                            await dbquery(sql,sql_parm)
                        }
                    }

                    let sql = `INSERT INTO votes (id,user,post,type,up_down) VALUES (NULL, ? ,? , ?, ?);`
                    let sql_parm = [username,post,type,vote]
                    
                    await dbquery(sql,sql_parm)

                    let sql1 = `SELECT * FROM posts WHERE id = ?;`
                    let sql_parm1 = [post]

                    let currnet_amount = await dbquery(sql1,sql_parm1)

                    let current = currnet_amount[0].votes

                    if(vote == -1) current = current - 1 + repair
                    else if(vote == 1) current = current + 1 + repair
                    

                    console.log(current)

                    let sql2 = `UPDATE posts SET votes = ? WHERE id = ?;`
                    let sql_parm2 = [current,post]
                    
                    await dbquery(sql2,sql_parm2)

                    res.send({
                        final: 'voted',
                        current: current
                    })

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