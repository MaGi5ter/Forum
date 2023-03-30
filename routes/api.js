//my first ever try to make some pseudo api

const express = require('express')
const router = express.Router()
let db = require('../mysql')  
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json({ limit: '50mb' });
const urlencodedParser = bodyParser.urlencoded({ extended: true, limit: '50mb' });

router.use(jsonParser);
router.use(urlencodedParser);

// Since the hyphen (-) and the dot (.) are interpreted literally,
// they can be used along with route parameters for useful purposes.

router
    .route("/:type")
    .get(async (req,res) => {

        if(req.params.type == 'posts') {

            //it responds with data of latest posts, used for main page "/"

            //https://discord.com/api/v9/channels/684116498070896721/messages?before=1082416576982155335&limit=50
            
            let before = req.query.before
            let votes_type = req.query.type

            console.log(Date.now())
            
            if(before == undefined || votes_type == undefined) res.send('nothin')
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

                    let sql1 = `SELECT post,type,up_down FROM votes WHERE post in (${posts_id.toString()}) AND user = ? AND type = ?;`
                    let sql1_param = [req.session.username,votes_type]

                    let votes = await dbquery(sql1,sql1_param)

                    // console.log(votes)

                    res.send([posts,votes])


                } else {
                    res.send([await dbquery(sql , sql_parm)])
                }
            }

        }
        else if(req.params.type == 'activity') {

            //it will respond with selected user every activity // posts only

            let author = req.query.user
            if(author == undefined) res.send('nothin')
            else {
                let sql = `SELECT * FROM posts WHERE author = ? ORDER BY createdAt DESC LIMIT 50`
                let sql_parm = [author]
                let user_activity = await dbquery(sql,sql_parm)

                if(req.session.loggedIn == true) {

                    let posts_id = []

                    for (let index = 0; index < user_activity.length; index++) {
                        const element = user_activity[index];

                        posts_id.push(element.id)
                    }

                    let sql1 = `SELECT post,type,up_down FROM votes WHERE post in (${posts_id.toString()}) AND user = ? AND type = ?;`
                    let sql1_param = [req.session.username,'p']

                    let votes = await dbquery(sql1,sql1_param)

                    // console.log(votes)

                    res.send([user_activity,votes])


                } else {
                    res.send([user_activity])
                }
            }
        }
        // else if(req.params.type == 'comments') {

        //     //it will respond with selected post comments

        //     let post = req.query.post
        //     if(post == undefined) res.send('nothin')
        //     else {
        //         let sql = `SELECT * FROM comments WHERE postID = ? AND replyID IS NULL ORDER BY createdAt DESC LIMIT 50`
        //         let sql_parm = [post]

        //         let post_comment = await dbquery(sql,sql_parm)

        //         res.send(post_comment)
        //     }
        // }
        else if(req.params.type == 'comments') {

            //it will respond with selected post comments

            let comment = req.query.post
            if(comment == undefined) res.send('nothin')
            else {

                //I LOVE CHATGPT FOR THAT PIECE OF QUERY IT MAKES IT SO MUCH FASTER

                let sql = `
                WITH RECURSIVE comment_tree AS (
                    SELECT id, replyID, content, author, votes
                    FROM comments
                    WHERE replyID IS NULL AND postID = ?
                  
                    UNION ALL
                  
                    SELECT c.id, c.replyID, c.content, c.author, c.votes
                    FROM comments c
                    JOIN comment_tree ct ON c.replyID = ct.id
                  )
                  
                  SELECT * FROM comment_tree;
                
                `

                let sql_parm = [comment]
                let comment_replies = await dbquery(sql,sql_parm)

                console.log(comment_replies)

                if(req.session.loggedIn == true && comment_replies.length > 0) {

                    let user_comments_id = []

                    for (let index = 0; index < comment_replies.length; index++) {
                        const element = comment_replies[index];
                        
                        user_comments_id.push(element.id)
                    }

                    let sql1 = `SELECT post,type,up_down FROM votes WHERE post in (${user_comments_id.toString()}) AND user = ? AND type = 'c';`
                    let sql1_param = [req.session.username]

                    let votes = await dbquery(sql1,sql1_param)

                    res.send([comment_replies,votes])

                } else  res.send([comment_replies])
            }
        }
        else if(req.params.type == 'usercomments') {

            //it will respond with selected post comments

            let user_overview = req.query.user
            if(user_overview == undefined) res.send('nothin')
            else {
                let sql = `
                SELECT comments.postId, comments.createdAt ,comments.content, posts.content AS postContent, posts.author
                FROM comments
                JOIN posts ON comments.postId = posts.id
                WHERE comments.author = ?
                ORDER BY comments.createdAt DESC
                LIMIT 50`

                let sql_parm = [user_overview]

                let user_comments = await dbquery(sql,sql_parm)

                let respond_data = []

                for (let index = 0; index < user_comments.length; index++) {
                    const element = user_comments[index];

                    element.postTitle = JSON.parse(element.postContent)[0].content
                    element.postContent = undefined

                    respond_data.push(element)
                }

                res.send(respond_data)
            }
        }
        else if(req.params.type == 'post_data') {

            //it will respond with selected post data

            let post_id = req.query.id
            if(post_id == undefined) res.send('nothin')
            else {

                let sql = `SELECT * FROM posts WHERE id = ?`
                let sql_parm = [post_id]

                let post_data = await dbquery(sql,sql_parm)

                res.send(post_data)
            }
        }
        else if(req.params.type == 'users') {

            if(req.session.loggedIn == true) {
                let isAdmin = await dbquery('SELECT privileges FROM users WHERE login = ?',[req.session.username])
                isAdmin = isAdmin[0].privileges

                if(isAdmin > 0) {
                    const limit = 25;
                    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

                    const query = `SELECT * FROM users LIMIT ? OFFSET ?`;
                    let query_params = [limit,offset]

                    res.send(await dbquery(query,query_params))
                }

            }
        }
        else res.send({some: 'nothing'})

    })
    .post(async (req,res) => {
        if(req.params.type == "comment") {

            if(req.session.lastCommentTime == undefined) {
                console.log('first_POST')
                req.session.lastCommentTime = 0
            }            

            if(req.session.loggedIn == true && Date.now() - req.session.lastCommentTime > 1000 * 20) {

                data = req.body

                let post = await dbquery(`SELECT * FROM posts WHERE id = ?`,[data.postID])

                // console.log(post)

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
    
                    req.session.lastCommentTime = Date.now()

                    let sql = `INSERT INTO comments (id, authorID,author,               content,      createdAt, replyID,     postID) VALUES (NULL, ? ,? , ?, ?, ?,?);`
                    let sql_parm =                      [userID , req.session.username, data.content, Date.now() ,data.reply, data.postID]
                    
                    console.log(await dbquery(sql,sql_parm))

                    res.send('COMMENT ADDED')

                }
            }
            else if(Date.now() - req.session.lastCommentTime < 1000 * 20) {
                res.send("You've been rate limited")
            }
            else res.send('verification failed')
        }
        else if(req.params.type == 'vote') {
            if(req.session.loggedIn == true) {

                console.log(req.session)

                //it will respond with selected post comments
                let vote = req.body.vote
                let post = req.body.postID //it's named posts but it also is used when there are comments votes
                let type = req.body.type // p - posts ; c - comment

                console.log([vote,post,type])

                if(vote == undefined || post == undefined || type == undefined) res.send('not full data')
                else if(vote != -1 && vote != 1) res.send('bad vote')
                else if(type != 'p' && type != 'c') res.send('bad type')
                else {

                    // I WILL NEED TO MAKE SOME BETTER SQL QUERIES HERE BCS THERE IS TOO MUCH OF THEM

                    let username = req.session.username
                    let repair = 0 //used when sb change his mind and votes to opposite

                    let votes = await dbquery('SELECT * FROM votes WHERE user = ? AND post = ? AND type = ?',[username,post,type])
                    if(votes.length > 0) {
                        if(votes[0].up_down == vote) {

                            let sql = `DELETE FROM votes WHERE user = ? AND post = ? AND type = ?`
                            let sql_parm = [username,post,type]

                            dbquery(sql,sql_parm)  //DELETES VOTE FROM DB

                            let sql1 = ''
                            if(type == 'p') sql1 = `SELECT * FROM posts WHERE id = ?;`
                            else if(type == 'c') sql1 = `SELECT * FROM comments WHERE id = ?;`

                            let sql_parm1 = [post]
                            let currnet_amount = await dbquery(sql1,sql_parm1) //requests current amount of votes in post
        
                            let current = currnet_amount[0].votes - vote


                            let sql2
                            if(type == 'p') sql2 = `UPDATE posts SET votes = ? WHERE id = ?;`
                            else if(type == 'c') sql2 = `UPDATE comments SET votes = ? WHERE id = ?;`
                            let sql_parm2 = [current,post]
                            
                            await dbquery(sql2,sql_parm2)

                            res.send({
                                final: 'vote_deleted',
                                current: current
                            })
                            return 
                        }else {
                            let sql = `DELETE FROM votes WHERE user = ? AND post = ? AND type = ?`
                            let sql_parm = [username,post,type]

                            repair = repair + vote

                            console.log(repair)
                            
                            await dbquery(sql,sql_parm)
                        }
                    }

                    let sql1 = ''
                    if(type == 'p') sql1 = `SELECT * FROM posts WHERE id = ?;`
                    else if(type == 'c') sql1 = `SELECT * FROM comments WHERE id = ?;`
                    // let sql1 = `SELECT * FROM posts WHERE id = ?;`
                    let sql_parm1 = [post]

                    let currnet_amount = await dbquery(sql1,sql_parm1)
                    // console.log(currnet_amount,sql1)
                    let current = currnet_amount[0].votes

                    if(vote == -1) current = current - 1 + repair
                    else if(vote == 1) current = current + 1 + repair
                    
                    console.log(current)

                    ////////

                    let sql2
                    if(type == 'p') sql2 = `UPDATE posts SET votes = ? WHERE id = ?;`
                    else if(type == 'c') sql2 = `UPDATE comments SET votes = ? WHERE id = ?;`

                    // console.log(sql2)
                    let sql_parm2 = [current,post]
                    await dbquery(sql2,sql_parm2)

                    /////////

                    let sql = `INSERT INTO votes (id,user,post,type,up_down) VALUES (NULL, ? ,? , ?, ?);`
                    let sql_parm = [username,post,type,vote]
                    await dbquery(sql,sql_parm)

                    res.send({
                        final: 'voted',
                        current: current
                    })

                }
            }
            else res.send('verification failed')
        }
        else if(req.params.type == 'post') {

            if(req.session.lastPostTime == undefined) {
                console.log('first_POST')
                req.session.lastPostTime = 0
            }            

            if(req.session.loggedIn == true && Date.now() - req.session.lastPostTime > 1000 * 60 * 2 ) {
                let post_data = req.body
                let total_length = 0

                let approved_data = []

                let checks = {
                    title: false,
                    text_or_image:false,
                    accepted_total:false 
                }

                let breaked = false

                // console.log(post_data)

                for (let index = 0; index < post_data.length; index++) {
                    const element = post_data[index];

                    // console.log(element)
                    
                    if(element.type == 'title') {
                        if(element.content.length > 0 && element.content.length <= 300) {
                            if (element.content.trim() === '') {
                                res.send({error: "incorrect title"})
                                breaked = true
                                break
                            }
                            else {
                                approved_data.push(element)
                                checks.title = true
                            }
                        }
                        else {
                            res.send({error: "incorrect title length"})
                            breaked = true
                            break
                        }
                    }
                    else if(element.type == 'text') {
                        if(element.spoiler == false || element.spoiler == true) { //to prevent from some weird data being put here
                            if(element.nsfw == true || element.nsfw == false) {
                                if(element.content.length > 0) {
                                    if(element.content.includes('<')) {
                                        res.send({error: "You can't use some symbols"})
                                        breaked = true
                                        break
                                    }
                                    else {
                                        total_length += element.content.length
                                        approved_data.push(element)
                                        checks.text_or_image = true
                                    }
                                }
                                else {
                                    res.send({error: "text field cannot be empty"})
                                    breaked = true
                                    break
                                }
                            } else {
                                res.send({error: "weird data provided"})
                                breaked = true
                                break
                            }
                        }
                        else {
                            res.send({error: "weird data provided"})
                            breaked = true
                            break
                        }
                    }
                    else if(element.type == 'image') {
                        if(element.spoiler == false || element.spoiler == true) { //to prevent from some weird data being put here
                            if(element.nsfw == true || element.nsfw == false) {
                                
                                const maxSize = 8343552

                                function isBlobTooBig(blob) {
                                    return blob.size > maxSize;
                                }

                                if(isBlobTooBig(element.image)) {
                                    res.send({error: "Image too big"})
                                    breaked = true
                                    break
                                }
                                else {
                                    approved_data.push(element)
                                    checks.text_or_image = true
                                }
                            } else {
                                res.send({error: "weird data provided"})
                                breaked = true
                                break
                            }
                        }
                        else {
                            res.send({error: "weird data provided"})
                            breaked = true
                            break
                        }
                    }
                }

                if(breaked == true) return

                if(approved_data.length != post_data.length) {
                    res.send({error: "Your post had issue"})
                }
                else if (total_length > 8000) {
                    res.send({error: "Your post text was too long"})
                }
                else {  //here data provided by user is accepted

                    //SIMPLE LIMIT HOW MANY POSTS USER CAN CREATE // TO AVOID SPAM
                    req.session.lastPostTime = Date.now()

                    let finall_data = []

                    for (let index = 0; index < approved_data.length; index++) {
                        let element = approved_data[index];
                        if(element.type == 'image') {
                            let base64 = element.image
                            const image = new Buffer.from(base64.split(",")[1], "base64");
                            let uploader = require('../uploader')
                            let url = await uploader(image)
                            element.image = url
                            finall_data.push(element)
                        }
                        else finall_data.push(element)
                    }

                    let data_to_db = JSON.stringify(finall_data)

                    console.log(finall_data)
                    console.log(req.session.username)

                    let getIDsql = `SELECT ID FROM users WHERE token = ?`
                    let sql_parm = [req.session.token[0].token]

                    let id = await dbquery(getIDsql,sql_parm)

                    if(id.length > 0) {
                        console.log(id)
                        let sql = `INSERT INTO posts (ID, authorID, author,               createdAt,  content) VALUES (NULL, ? ,? , ?, ?);`
                        let sql_parm =              [     id[0].ID, req.session.username, Date.now(), data_to_db ,]


                        console.log(req.session)
                        console.log(await dbquery(sql,sql_parm))

                        await sleep(500)
                        res.send('redirect')
                    }

                }
            }
            else if(Date.now() - req.session.lastPostTime < 1000 * 60 * 2) {
                res.send({error: "You've been rate limited"})
            }
            else res.send({error: "Authorize"})
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }