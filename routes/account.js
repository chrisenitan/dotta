const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult } = require("express-validator")
const localTools = require("../subModules/localTools")

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
appRouter.get("/trial", (req, res)=>{
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
  [
    //do some form sanitisation. need a module
    check("email", "Email is invalid").isEmail(),
    check("action", "Action is not signup").equals("signUp"),
  ],
  (req, res) => {
    //get request body
    let signUpData = req.body

    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      //return res.status(400).json({ errors: reqErr.array() })
      let sanitryError = reqErr.array()[0]
      res.render("profile", sanitryError)
    } else {
      //demo
      let isNewUser = {
        email: signUpData.email,
      }
      res.render("profile", isNewUser)
    }

    /*  //signup
  let signUp = `INSERT INTO profiles SET ?`
  sqldb.query(signUp, signUpData, (err, signupResult, field) => {
    if (err) throw err
    if (signupResult.insertId != undefined) {
      //define and set cookie
      let ranVal = localTools.randomValue()
      signupResult.cookie = ranVal
      res.cookie("user", signupResult.cookie)
      //trim new user profile
      let newUser = {
        email: signupResult.email,
      }
      //render onboarding or something
      res.render("profile", newUser)
    }
  }) */
  }
)

//all recovery of account
appRouter.get("/recovery", (req, res) => {
  res.json({
    message: "recover account here",
  })
})

module.exports = appRouter
