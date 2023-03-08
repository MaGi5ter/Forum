const express = require('express')
const router = express.Router()

router
    .route("/")
    .get((req,res) => {

        res.render('login', {
            error_register : req.session.register_message,
            error_login : req.session.login_message,
            complete_register :req.session.register_complete_message,
        } )
    })

module.exports = router