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
  }
  res.render("index")
})

//login
appRouter.get("/login", (req, res) => {
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
  //get cookie
  const cookie = req.cookies
  //get account via cookie or via req
  console.log("/username hit")

  /* //checko for cookie
  if (req.cookies.user) {
    //cookie exists. go get name from db
  } else {
    //no cookie, just set a name to get from db
  } */

  let getUser =
    `SELECT * FROM profiles WHERE cookie = ` +
    sqldb.escape(req.cookies.user) +
    `LIMIT 1`
  sqldb.query(getUser, (err, returnedUser) => {
    if (err) throw err
    if (Object.keys(returnedUser).length != 0) {
      res.render("home", returnedUser[0])
    } else {
      //no user found
      const loginError = {}
      loginError.errReason = { msg: "No user found for that email" }
      loginError.status = false
      res.render("profile", loginError)
    }
  })

  /*  if(createAccount == true){
  //no cookie. login via db
  const user = {}
  user.username = req.params.username
  res.render("profile", user)
  }else{
    //send no data somewhere 
    return false
  } */
})

module.exports = appRouter
