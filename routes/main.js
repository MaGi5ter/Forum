const express = require('express')
const router = express.Router()

router
    .route("/")
    .get((req,res) => {

        if(req.session.loggedIn == true) {
            res.render('index',{
                logged_status:  'Logout',
                link: 'auth/logout',
                username: `Welcome ${req.session.username}`,
            })
        }
        else {
            res.render('index',{
                logged_status:  'Login',
                link: 'login',
                username: '',
            })
        }
    })

module.exports = router