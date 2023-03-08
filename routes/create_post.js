const express = require('express')
const router = express.Router()

router
    .route("/")
    .get((req,res) => {

        if(req.session.loggedIn == true) {
            res.render('createpost',{
                logged_status:  'Logout',
                link: 'auth/logout',
                username: `Welcome ${req.session.username}`,
            })
        }
        else {
            req.session.login_message = 'You need to login first'
            res.redirect('/login')
        }
    })

module.exports = router