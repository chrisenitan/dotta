const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")
const { ResumeToken } = require("mongodb")

//set mysql
const sqldb = mysql.createConnection({
  host: process.env.gcpserver,
  user: process.env.gcpuser,
  password: process.env.gcppass,
  database: process.env.gcpdb,
})

//connect mysql
sqldb.connect((err) => {
  if (err) {
    throw err
  }
  console.log(
    `Route = /account: Connected to ${process.env.gcpserver} on thread: ${sqldb.threadId}`
  )
})

/* var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}

appRouter.get('/ex', [cb0, cb1, cb2]) */

//magic mode
var insertNewAccount = function (req) {
  const reqUser = req

  //create other needed data
  let ranCookie = localTools.randomValue(8)
  let ranUsername = localTools.randomValue(6)
  req.cookie = ranCookie
  req.username = ranUsername

  //use those to create account
  let trialSignUp = `INSERT INTO profiles SET ?`
  sqldb.query(trialSignUp, reqUser, (err, signupResult, fields) => {
    if (err) {
      console.log("sorry again")
    }
    if (signupResult.insertId != undefined) {
      console.log("testing done succ")
    }
  })

  //strip secure dtat here first... wip

  return req
}

//trial mode
appRouter.get("/trial", (req, res) => {
  //clear existing cookie
  res.clearCookie("user")
  //
  let ranUsername = localTools.randomValue(6)
  let ranPassword = localTools.secureKey(6)

  //give rand name and acct values
  var req = {}
  req.password = ranPassword
  req.email = `${ranUsername}@subs.vrixe.com`

  let createUser = insertNewAccount(req)
  //set client cookie
  res.cookie("user", createUser.cookie, {
    maxAge: 2592000000,
    httpOnly: false,
  })

  //render onboarding or something
  res.render("profile", createUser)
})

//login
appRouter.post(
  "/login",
  [
    //check("email", "Email format is invalid").isEmail(),
    check("action", "Action is not login").equals("logIn"),
  ],
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
        `SELECT * FROM profiles WHERE email = ` +
        sqldb.escape(req.body.email) +
        `OR username = ` +
        sqldb.escape(req.body.email) +
        `AND password = ` +
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
          loginError.errReason = { msg: "No user found for that email" }
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
    check("email", "Email format is invalid").isEmail(),
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
      //check for old emails
      let checkForUniqueMail =
        `SELECT * FROM profiles WHERE email = ` +
        sqldb.escape(signUpData.email) +
        `LIMIT 1`
      sqldb.query(checkForUniqueMail, (err, result) => {
        if (err) throw err
        if (Object.keys(result).length == 0) {
          //register user
          let createUser = insertNewAccount(signUpData)
          //set client cookie
          res.cookie("user", createUser.cookie, {
            maxAge: 2592000000,
            httpOnly: false,
          })
          res.render("profile", createUser)
        }
        //found existing user, do not regiater
        else {
          signupError.errStatus = false
          signupError.errReason = { msg: "Email has already been registered" }
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
