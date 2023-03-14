const express = require('express')
const router = express.Router()

router
    .route("/")
    .get((req,res) => {

        console.log(req.session)

        req.session.login_message = ''
        req.session.register_complete_message = ''
        req.session.register_message = ''

        if(req.session.loggedIn == true) {

            res.render('index',{
                logged_status:  'Logout',
                link: 'auth/logout',
                username: `Welcome ${req.session.username}`,
                user_profile: req.session.username
            })
        }
        else {

            res.render('index',{
                logged_status:  'Login',
                link: 'login',
                username: '',
                user_profile: ''
            })
        }
    })

module.exports = router