const express = require('express')
const router = express.Router()
const sha256 = require('sha256')
let db = require('../mysql')  

router
    .route("/:type")
    .post(async (req,res,next) => {

        console.log(req.params.type)
        // LOGIN SCRIPT
        if(req.params.type == 'login') {

            function redirect_message(msg) {
                req.session.login_message = msg
                res.redirect('/login')
            }

            console.log(req.body) // { email: '', password: '' }

            let login = req.body.login
            let password = req.body.password
            
            if(login == '' || password == '') redirect_message("Login/Password can't be empty")
            
            password = sha256(password)

            if(login.includes("'") || login.includes(";")) redirect_message("something went wrong")

            let row = await dbquery(`SELECT * FROM users WHERE login = '${login}' AND password = '${password}'`)

            console.log(row)
            if(row.length > 0) {

                req.session.token = await dbquery(`SELECT token FROM users WHERE login = '${login}' AND password = '${password}'`)
                req.session.loggedIn = true
                req.session.username = login
                //jacapraca

                res.redirect('/')

            }
            else redirect_message("password / login is wrong")

        } else next()
    },async (req,res, next) => {
        // REGISTER ACCOUNT SCRIPT

        console.log(req.params.type)

        if(req.params.type == 'register') {

            function redirect_message(msg) {
                req.session.register_message = msg
                res.redirect('/login')
            }

            if(req.body.login == '') {
                redirect_message('No Login Provided')
            }
            else if (req.body.login.length > 20 || req.body.login.length < 4 ) {
                redirect_message('Your login need to be beetween 4-20 characters')
            }
            else if(req.body.email == '') {
                redirect_message('No email Provided')
            }
            else if(checkIfEmail(req.body.email) == false) {
                redirect_message('This is not email')
            }
            else if(req.body.email > 254) {
                redirect_message('This email is too Long')
            }
            else if(req.body.password[0] == '' || req.body.password[1] == '') {
                redirect_message('No Password Provided')
            }
            else if(req.body.password[0] != req.body.password[1]) {
                redirect_message('Passwords dont match')
            }
            else if(req.body.password[1] > 64) {
                redirect_message('Your Password is too long')
            }
            // else if() {

            // }
            else {

                let login = req.body.login
                let email = req.body.email

                if(login.includes("'") || email.includes("'")) return

                let test_login = await dbquery(`SELECT * FROM users WHERE login = '${login}'`)
                let test_email = await dbquery(`SELECT * FROM users WHERE email = '${email}'`)

                if(test_login.length > 0 || test_email.length > 0) {
                    redirect_message('This email or login is already used')
                    return
                }

                let password = sha256(req.body.password[1])

                console.log( login,email,password)

                let token = sha256(`${Date.now()}${password}${login}`) //will be used for some api requests I plan to add

                let sql = `INSERT INTO users (ID, login, email, password, privileges, token) VALUES (NULL, '${login}', '${email}', '${password}', '0','${token}');`

                await dbquery(sql)

                req.session.register_complete_message = 'Account Created You can LogIn now'

                res.redirect('/login')
            }

        } else if(req.params.type == 'logout') {

            req.session.loggedIn = false
            req.session.token = ''
            res.redirect('/')

        } else res.redirect('/')
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

function checkIfEmail(str) {
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return regexExp.test(str);
  }