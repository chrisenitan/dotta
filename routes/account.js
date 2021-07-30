const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")

//set mysql data
const sqldb = mysql.createConnection({
  host: process.env.awsserver,
  port: process.env.awsport,
  user: process.env.awsuser,
  password: process.env.awspass,
  database: process.env.awsdb,
})

//connect mysql
sqldb.connect((err) => {
  if (err) {
    throw err
  }
  console.log(
    `Route = /account: Connected to ${process.env.awsserver} on thread: ${sqldb.threadId}`
  )
})

//magic mode: insert new account reuse
var insertNewAccount = function (req) {
  const reqUser = req

  //create other needed data
  let ranCookie = localTools.randomValue(8)
  req.cookie = ranCookie

  //use those to create account
  let trialSignUp = `INSERT INTO profiles SET ?`
  sqldb.query(trialSignUp, reqUser, (err, signupResult, fields) => {
    if (err) {
      console.log("Errorr inserting new user")
    }
    if (signupResult.insertId != undefined) {
      console.log("New user created")
    }
  })

  //strip secure dtat here first... wip

  return req
}

//trial sign up
appRouter.get("/trial", (req, res) => {
  //clear existing cookie
  res.clearCookie("user")
  //reload of this url should not resignup. app makes sure cookie logeed in is redirected

  let ranUsername = localTools.randomValue(6)
  let ranPassword = localTools.secureKey(6)

  //give rand name and acct values
  var userData = {}
  userData.password = ranPassword
  userData.username = `${ranUsername}`
  userData.currency = "$"

  let createUser = insertNewAccount(userData)
  //set client cookie
  res.cookie("user", createUser.cookie, {
    maxAge: 2592000000,
    httpOnly: false,
  })

  //create goodwill message
  createUser.goodWill = req.goodWill
  //render onboarding or something
  res.render("profile", createUser)
})

//login
appRouter.post(
  "/login",
  [check("action", "Action is not login").equals("logIn")],
  (req, res) => {
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
    } else {
      let loginUser =
        `SELECT * FROM profiles WHERE username = ` +
        sqldb.escape(req.body.username) +
        ` AND password = ` +
        sqldb.escape(req.body.password) +
        `LIMIT 1`
      sqldb.query(loginUser, (err, returnedUser) => {
        if (err) throw err
        if (Object.keys(returnedUser).length != 0) {
          //user found, set new cookie
          res.cookie("user", returnedUser[0].cookie, {
            maxAge: 2592000000,
            httpOnly: false,
          })
          console.log(returnedUser[0])
          res.redirect(`/${returnedUser[0].username}`)
        } else {
          //no user found
          loginError.errReason = { msg: "No user found for that username" }
          loginError.status = false
          res.render("login", loginError)
        }
      })
    }
  }
)

//sign up
appRouter.post(
  "/signup",
  //do some form sanitisation. need a module
  [
    check("username", "Name should not have spaces").isAlpha("en-US"),
    check("action", "Action is not signup").equals("signUp"),
  ],
  (req, res) => {
    //get request body and remove defaul action
    delete req.body.action
    let signUpData = req.body
    //define account creation status object
    const signupError = {}

    //check for express validations
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      //return res.status(400).json({ errors: reqErr.array() })
      signupError.errReason = reqErr.array()[0]
      signupError.errStatus = false
      res.render("signup", signupError)
    } else {
      //check for old usernames
      let checkForUniqueuserName =
        `SELECT * FROM profiles WHERE username = ` +
        sqldb.escape(signUpData.username) +
        `LIMIT 1`
      sqldb.query(checkForUniqueuserName, (err, result) => {
        if (err) throw err
        if (Object.keys(result).length == 0) {
          //register user
          let createUser = insertNewAccount(signUpData)
          //set client cookie
          res.cookie("user", createUser.cookie, {
            maxAge: 2592000000,
            httpOnly: false,
          })
          createUser.goodWill = req.goodWill
          res.render("profile", createUser)
        }
        //found existing user, do not regiater
        else {
          signupError.errStatus = false
          signupError.errReason = { msg: "Name has already been registered" }
          res.render("signup", signupError)
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
