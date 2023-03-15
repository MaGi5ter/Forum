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
                res.render('post',{
                    post: {
                        id : postData[0].id,
                        author : postData[0].author,
                        content: postData[0].content,
                        title: postData[0].title
                    },
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
                        title: postData[0].title
                    },
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