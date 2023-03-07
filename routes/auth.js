const express = require('express')
const router = express.Router()

router
    .route("/:type")
    .post((req,res,next) => {
        // LOGIN SCRIPT
        console.log(req.params)

        if(req.params.type == 'login') {
            res.send('login')
        } else next()


    },(req,res) => {
        // REGISTER ACCOUNT SCRIPT
        if(req.params.type == 'register') {
            res.send('register')
        } else res.send('ERROR')
    })

module.exports = router