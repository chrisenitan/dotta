const express = require("express")
const { check, validationResult, cookie } = require("express-validator")
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
  res.redirect("/")
})

//signup
appRouter.get("/signup", (req, res) => {
  if (req.cookies.user) {
    res.clearCookie("user")
  }
  res.render("signup")
})

//settings
appRouter.get("/settings", (req, res) => {
  res.render("settings")
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
        //set user objct
        let user = returnedUser[0]
        //get users data from data table
        //...
        let getUserSubs = `SELECT * FROM subs WHERE username = '${user.username}'`
        sqldb.query(getUserSubs, (err, returnedSubs) => {
          if (err) throw err
          if (Object.keys(returnedSubs).length != 0) {
            //set subs to user obj
            user.subs = returnedSubs
          }
          console.log(user)
          res.render("home", user)
        })
      } else {
        //no user found for provided username
        const loginError = {}
        loginError.errReason = { msg: "No valid user found" }
        loginError.status = false
        res.render("home", loginError)
      }
    })
  } else {
    res.redirect("/")
  }
})

//save or update new sub entry
appRouter.post(
  "/record",
  [
    check("name", "Name is not valid").isAlpha(),
    check("cost", "Cost needs to be a number").isNumeric(),
    check("startDate", "Date should be calendar date").isDate(),
    check("action", "Action is not login").equals("create"),
  ],
  (req, res) => {
    //define login status handler
    const createError = {}
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      createError.errReason = reqErr.array()[0]
      createError.errStatus = false
      res.send(createError.errReason.msg)
    } else {
      res.send("save subs data here")
    }
  }
)

module.exports = appRouter
