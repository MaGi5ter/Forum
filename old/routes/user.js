const express = require('express')
const router = express.Router()
let db = require('../mysql')  

router
    .route("/:username")
    .get(async (req,res) => {

        let user_username = req.params.username

        console.log(req.session)

        let sql = `SELECT * FROM users WHERE login = ?`
        let sql_parm = [user_username]

        let user_data = await dbquery(sql,sql_parm)

        //console.log(user_data)

        if(user_data.length > 0) {

            //here I've learned how to use callbacks in functions

            // function test(data, callback) {
            //     return callback(data)
            // }
            
            // test('data_tru',(whatcomesback) => {
            //     console.log(whatcomesback)
            // })

            if(req.session.loggedIn == true) {
                res.render('user',{
                    logged_status:  'LOGOUT',
                    link: 'auth/logout',
                    username: user_data[0].login,
                })
    
            }
            else {
                res.render('user',{
                    logged_status:  'LOGIN',
                    link: 'login',
                    username: user_data[0].login,
                })
            }
        }
        else res.send('USER NOT FOUND')


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