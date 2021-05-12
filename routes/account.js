const express = require("express")
const mysql = require("mysql")
const appRouter = express()

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

appRouter.post("/signup", (req, res) => {
  res.json({
    message: "signup acocunt here",
  })
})





module.exports = appRouter
