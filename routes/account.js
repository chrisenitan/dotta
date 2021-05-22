const express = require("express")
const mysql = require("mysql")
const appRouter = express()
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

appRouter.post("/login", (req, res) => {
  res.json({
    message: "login acocunt here",
  })
})

//sign up
appRouter.post("/signup", (req, res) => {
  //get request body
  let signUpData = req.body
  //do some sanitisation
  let ranVal = localTools.randomValue()
  res.send(`Cookie gotten ${ranVal}`) 
 

  //signup
/*   let signUp = `INSERT INTO profiles SET ?`
  sqldb.query(signUp, signUpData, (err, signupResult, field) => {
    if (err) throw err
    if (signupResult.insertId != undefined) {
      //define and set cookie
      let ranVal = localTools.randomValue
      console.log("randy is" + ranVal)
      signupResult.cookie = ranVal
      res.cookie("user", signupResult.cookie)
      //render onboarding or something
      res.render("profile", signupResult)
    }
  }) */
})

//all recovery of account
appRouter.get("/recovery", (req, res) => {
  res.json({
    message: "recover account here",
  })
})

module.exports = appRouter
