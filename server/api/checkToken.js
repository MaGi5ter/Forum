require('dotenv').config()

const express = require('express')
const router = express.Router()

router
    .route("/")
    .post(async (req,res) => {
        res.send({
            status:'valid'
        })
    })

module.exports = router