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
    `Route = /sub: Connected to ${process.env.gcpserver} on thread: ${sqldb.threadId}`
  )
})

//load and form sub
appRouter.get("/:id", (req, res) => {
  res.render("sub/subView")
})

module.exports = appRouter
