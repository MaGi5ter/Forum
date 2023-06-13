const express = require('express')
const router = express.Router()
let db = require('../mysql') 

router
    .route("/:id")
    .get(async (req,res) => {

        console.log(req.session)

        let postID = req.params.id

        let sql = `SELECT * FROM posts WHERE id = ?`
        let sql_parm = [postID]

        let postData = await dbquery(sql,sql_parm)

        console.log(postData)

        if(postData.length > 0) {

            if(req.session.loggedIn == true) {

                let sql1 = `SELECT post,type,up_down FROM votes WHERE post = ? AND user = ? AND type = 'p';`
                let sql1_param = [postID,req.session.username]

                let votes = await dbquery(sql1,sql1_param)

                let voted = 0

                if(votes.length > 0) {
                    voted = votes[0].up_down
                }

                console.log(voted)

                res.render('post',{
                    post: {
                        id : postData[0].id,
                        author : postData[0].author,
                        votes: postData[0].votes
                    },
                    voted : voted,
                    logged_status:  'Logout',
                    logged: true,
                    link: 'auth/logout',
                    username: `Welcome ${req.session.username}`,
                    user_profile: req.session.username
                })
            }
            else {
                res.render('post',{
                    post: {
                        id : postData[0].id,
                        author : postData[0].author,
                        content: postData[0].content,
                        title: postData[0].title,
                        votes: postData[0].votes
                    },
                    voted : 0,
                    logged_status:  'Login',
                    logged: false,
                    link: 'login',
                    username: `Welcome ${req.session.username}`,
                    user_profile: req.session.username
                })
            }

        } else {
            res.send('DONT FOUND THAT POST')
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