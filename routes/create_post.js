const express = require('express')
const router = express.Router()
let db = require('../mysql') 

router
    .route("/")
    .get((req,res) => {

        if(req.session.loggedIn == true) {
            res.render('createpost',{
                logged_status:  'Logout',
                link: 'auth/logout',
                username: `Welcome ${req.session.username}`,
                error_h3: req.session.message
            })

            req.session.message = ''
        }
        else {
            req.session.login_message = 'You need to login first'
            res.redirect('/login')
        }
    })
    .post(async (req,res) => {

        function redirect_message(msg) {
            req.session.message = msg
            res.redirect('/create_post')
        }

        let title = req.body.title
        let content = req.body.content

        if(content.includes('<')) redirect_message("You can't use some symbols")
        else if(title == '' || content == '') redirect_message("Can't be empty")
        else if(content.length > 4000) redirect_message("Your content is too long")
        else if(title.length > 50) redirect_message("Your title is too long")
        else {

            console.log(req.session)

            let getIDsql = `SELECT ID FROM users WHERE token = '${req.session.token[0].token}'`

            let id = await dbquery(getIDsql)
            
            if(id.length > 0) {

                console.log(id)
                let sql = `INSERT INTO posts (ID, authorID,author, createdtimestamp, content, title) VALUES (NULL, '${id[0].ID}','${req.session.username}', '${Date.now()}', '${content}','${title}');`

                console.log(req.session)
                console.log(await dbquery(sql))

                res.redirect('/')

            }

            console.log(req.body)

        }

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