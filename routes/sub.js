const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")
const { ResumeToken } = require("mongodb")

//set mysql
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
    `Route = /sub: Connected to ${process.env.awsserver} on thread: ${sqldb.threadId}`
  )
})

//load and form sub
appRouter.get("/:ref", (req, res) => {
  if (req.params.ref) {
    let getSub =
      `SELECT * FROM subs WHERE ref =` +
      sqldb.escape(req.params.ref) +
      `LIMIT 1`
    sqldb.query(getSub, (err, resultSub) => {
      if (err) {
        console.log(err)
      }
      if (Object.keys(resultSub).length != 0) {
        console.log(resultSub[0])
        res.render("sub/subView", resultSub[0])
      } else {
        res.send("did not find any sub with that ref")
      }
    })
  } else {
    res.render("sub/subView")
  }
})

module.exports = appRouter
