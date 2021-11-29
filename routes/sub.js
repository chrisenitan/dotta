const express = require("express")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")
const sqldb = require("../connectDb.js")

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
            //block access if user is not authorised
            if (user.cookie != req.cookies.c_auth) {
              //no sub found with provided id
              const error = {
                message: "This is a 401",
                description: "You do not have proper permissions to view this data.",
                status: "401",
              }
              error.appGlobal = req.appGlobal
              error.appGlobal.goodWill = `"${req.params.ref}" is blocked`
              res.render("status", error)
              return false
            }
            //get sub ledger information if username is found
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
        //no sub found with provided id
        const error = {
          message: "This is a 404",
          description:
            "The page you expected does not exist, please check the link for errors or refresh later",
          status: "404",
        }
        error.appGlobal = req.appGlobal
        error.appGlobal.goodWill = `"${req.params.ref}" is not found`
        res.render("status", error)
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
