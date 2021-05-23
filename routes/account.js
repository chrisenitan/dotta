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
appRouter.post("/login", (req, res) => {
  res.json({
    message: "login acocunt here",
  })
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
    const createAccount = {}

    //check for express validations
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      //return res.status(400).json({ errors: reqErr.array() })
      createAccount.reason = reqErr.array()[0]
      createAccount.status = false
      res.render("home", createAccount)
    } else {
      //check for old emails
      let checkForUniqueMail =
        `SELECT * FROM profiles WHERE email = ` +
        sqldb.escape(signUpData.email) +
        `LIMIT 1`
      sqldb.query(checkForUniqueMail, (err, result) => {
        if (err) throw err
        if (Object.keys(result).length == 0) {
          //register user
          let signUp = `INSERT INTO profiles SET ?`
          sqldb.query(signUp, signUpData, (err, signupResult, field) => {
            if (err) throw err
            if (signupResult.insertId != undefined) {
              //define and set cookie
              let ranVal = localTools.randomValue()
              signupResult.cookie = ranVal
              res.cookie("user", signupResult.cookie, {
                maxAge: 2592000000,
                httpOnly: false,
              })
              //trim new user profile
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
          createAccount.status = false
          createAccount.reason = { msg: "Email has already been registered" }
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
