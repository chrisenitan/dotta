const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")

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
  console.log(`Route = /sub: Connected to ${process.env.awsserver} on thread: ${sqldb.threadId}`)
})

//load and form sub
appRouter.get("/:ref", (req, res) => {
  if (req.params.ref) {
    let getSub = `SELECT * FROM subs WHERE ref =` + sqldb.escape(req.params.ref) + `LIMIT 1`
    sqldb.query(getSub, (err, resultSub) => {
      if (err) {
        console.log(err)
      }
      if (Object.keys(resultSub).length != 0) {
        const subData = resultSub[0]
        //get owning user
        let getUser =
          `SELECT * FROM profiles WHERE username = ` + sqldb.escape(subData.username) + `LIMIT 1`
        sqldb.query(getUser, (err, returnedUser) => {
          if (err) throw err
          if (Object.keys(returnedUser).length != 0) {
            //set user objct
            let user = returnedUser[0]
            //get sub ledge information if username is found
            let getSubLedger = `SELECT * FROM ledger WHERE ref = '${subData.ref}' ORDER BY dateEntered ASC`
            sqldb.query(getSubLedger, (err, resultSubLegder) => {
              if (err) throw err

              if (Object.keys(resultSubLegder).length != 0) {
                //define when subs was first logged
                subData.started = resultSubLegder[0].dateEntered
                const billings = localTools.getArraySum(resultSubLegder)
                subData.billings = billings
              } else {
                //define when subs was first logged and billed
                subData.lastBilled = "Upcoming"
                subData.started = "Upcoming"
                //set default values
                const billing = {
                  costSum: 0,
                  costCount: 0,
                }
                subData.billings = billing
              }
              //set goodwill message
              subData.user = user
              subData.appGlobal = req.appGlobal
              //console.log(subData)
              res.render("sub/subView", subData)
            })
          } else {
            //sub found but has no user, not safe to display information
            res.send("This data might be protected")
          }
        })
      } else {
        const resData = {
          errReason: {
            msg: "We could not find the data you requested",
          },
        }
        res.render("sub/subView", resData)
      }
    })
  } else {
    res.render("sub/subView")
  }
})

//delete sub
appRouter.get("/delete/:ref", (req, res) => {
  if (req.params.ref) {
    let deleteSub = `DELETE FROM subs WHERE ref =` + sqldb.escape(req.params.ref) + `LIMIT 1`
    sqldb.query(deleteSub, (err, resultDeleteSub) => {
      if (err) {
        console.log(err)
        return false
      }
      if (Object.keys(resultDeleteSub).length != 0) {
        res.redirect("/")
      } else {
        res.send("did not find any sub with that ref")
      }
    })
  } else {
    res.redirect("/")
  }
})

module.exports = appRouter
