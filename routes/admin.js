const express = require('express')
const router = express.Router()
let db = require('../mysql')  

router
    .route("/")
    .get(async (req,res) => {

        if(req.session.loggedIn == true) {
            let admin = await dbquery('SELECT privileges FROM users WHERE login = ?',[req.session.username])
            admin = admin[0].privileges

            if(admin < 1) {
                res.send('YOU DONT HAVE ACCES TO THAT WEBSITE')
            } else {
                console.log(admin)
                res.render('admin')
            }
        }
        else {
            res.redirect('/login')
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}