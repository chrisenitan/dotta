const express = require("express")
const { cookie } = require("express-validator")
const mysql = require("mysql")
const appRouter = express()

const sqldb = mysql.createConnection({
  host: process.env.gcpserver,
  user: process.env.gcpuser,
  password: process.env.gcppass,
  database: process.env.gcpdb,
})

sqldb.connect((err) => {
  if (err) {
    console.log(
      `Error connecting to ${process.env.gcpserver} on thread: ${sqldb.threadId}`
    )
    console.log(err)
  } else {
    console.log(
      `Route = /indexRoute: Connected to ${process.env.gcpserver} on thread: ${sqldb.threadId}`
    )
  }
})

appRouter.get("/", (req, res) => {
  const cookie = req.cookies
  if (cookie.user != undefined) {
    console.log(`home dir: found cookie: ${cookie.user}`)
    //res.clearCookie("user")//for now
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` +
      sqldb.escape(cookie.user) +
      `LIMIT 1`
    sqldb.query(getUser, (err, result) => {
      if (err) {
        console.log("User not fetchs via cookie")
        return false
      }
      if (Object.keys(result).length != 0) {
        res.redirect(`/${result[0].username}`)
      }
    })
  } else {
    res.render("index")
  }
})

//login
appRouter.get("/login", (req, res) => {
  if (req.cookies.user) {
    res.clearCookie("user")
  }
  res.render("login")
})

//logout
appRouter.get("/logout", (req, res) => {
  if (req.cookies.user) {
    res.clearCookie("user")
  }
  res.render("login")
})

//signup
appRouter.get("/signup", (req, res) => {
  if (req.cookies.user) {
    res.clearCookie("user")
  }
  res.render("signup")
})

//profile
appRouter.get("/:username", (req, res) => {
  //set dependecies
  const cookie = req.cookies
  const paramUser = req.params.username

  //only show if user is logged in and sessioned
  if (paramUser && cookie.user) {
    let getUser =
      `SELECT * FROM profiles WHERE username = ` +
      sqldb.escape(paramUser) +
      `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        //get users data from data table
        //...

        res.render("home", returnedUser[0])
      } else {
        //no user found for provided username
        const loginError = {}
        loginError.errReason = { msg: "No valid user found" }
        loginError.status = false
        res.render("home", loginError)
      }
    })
  }
  else{
    res.redirect("/")
  }
})

module.exports = appRouter
