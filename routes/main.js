const express = require('express')
const router = express.Router()

router
    .route("/")
    .get((req,res) => {

        res.render('index',{
            // blocks:  JSON.stringify(globals.block),
            // hgh: JSON.stringify(globals.hgh),
            // send: req.session.sendSocket 
        })

    })

module.exports = router