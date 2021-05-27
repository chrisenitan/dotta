const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")
const { ResumeToken } = require("mongodb")

//set mysql
const sqldb = mysql.createConnection({
  host: process.env.fhserver,
  user: process.env.fhuser,
  password: process.env.fhpass,
  database: process.env.fhdb,
})
//connect mysql
sqldb.connect((err) => {
  if (err) {
    throw err
  }
  console.log(
    `Route: Account: connected to Account ${process.env.fhserver} on thread: ${sqldb.threadId}`
  )
})

//BEGIN ROUTES

//trial mode
appRouter.get("/trial", (req, res) => {
  //clear existing cookie
  //create cookie
  //give rand name and acct values
  //use those to create account
  //render profile
  res.send("You are trying this app")
})

//login
appRouter.post("/login", [
  check("email", "Email format is invalid").isEmpty(),
    check("action", "Action is not login").equals("logIn"),
], (req, res) => {
  //clear existing cookie
  res.clearCookie("user")

  //define login status handler
  const loginError = {}
  //check validation result
  const reqErr = validationResult(req)
  if (!reqErr.isEmpty()) {
    //return res.status(400).json({ errors: reqErr.array() })
    loginError.errReason = reqErr.array()[0]
    loginError.errStatus = false
    res.render("login", loginError)
  }
  else{
    let loginUser = `SELECT * FROM profiles WHERE email = ` + sqldb.escape(req.email) + `LIMIT 1`
    sqldb.query(loginUser, (err, returnedUser)=>{
      if (err) throw err
      if(Object.keys(returnedUser).length != 0){
        //user found
        res.cookie("user", returnedUser.cookie, {
          maxAge: 2592000000,
          httpOnly: false,
        })
        res.render("home", returnedUser)
      }
      else{
        //no user found
        loginError.errReason = { msg: "No user found for that email" }
        loginError.status = false
        res.render("login", returnedUser)
      }
    })
  }

})

//sign up
appRouter.post(
  "/signup",
  //do some form sanitisation. need a module
  [
    check("email", "Email format is invalid").isEmpty(),
    check("action", "Action is not signup").equals("signUp"),
  ],
  (req, res) => {
    //delete old cookie now
    if (req.cookies.user) {
      res.clearCookie("user")
    }
    //get request body
    let signUpData = req.body
    //define account creation status object
    const signupError = {}

    //check for express validations
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      //return res.status(400).json({ errors: reqErr.array() })
      signupError.errReason = reqErr.array()[0]
      signupError.errStatus = false
      res.render("home", signupError)
    } else {
      //check for old emails
      let checkForUniqueMail =
        `SELECT * FROM profiles WHERE email = ` +
        sqldb.escape(signUpData.email) +
        `LIMIT 1`
      sqldb.query(checkForUniqueMail, (err, result) => {
        if (err) throw err
        if (Object.keys(result).length == 0) {
          //define and set cookie and other data 
          let ranVal = localTools.randomValue()
          signUpData.cookie = ranVal
          //register user
          let signUp = `INSERT INTO profiles SET ?`
          sqldb.query(signUp, signUpData, (err, signupResult, fields) => {
            if (err) throw err
            if (signupResult.insertId != undefined) {
              //set client cookie
              res.cookie("user", signUpData.cookie, {
                maxAge: 2592000000,
                httpOnly: false,
              })
              //set new user profile obj
              let newUser = {
                email: signupResult.email,
              }
              //render onboarding or something
              res.render("profile", newUser)
            }
          })
        }
        //found existing user, do not regiater
        else {
          signupError.errStatus = false
          signupError.errReason = { msg: "Email has already been registered" }
          res.render("signup", returnedUser)
        }
      })
    }
  }
)

//all recovery of account
appRouter.get("/recovery", (req, res) => {
  res.json({
    message: "recover account here",
  })
})

module.exports = appRouter
