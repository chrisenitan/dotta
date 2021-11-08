const express = require("express")
const { body, check, validationResult, cookie } = require("express-validator")
const mysql = require("mysql")
const appRouter = express()
const localTools = require("../subModules/localTools")

const sqldb = mysql.createConnection({
  host: process.env.awsserver,
  port: process.env.awsport,
  user: process.env.awsuser,
  password: process.env.awspass,
  database: process.env.awsdb,
})

sqldb.connect((err) => {
  if (err) {
    console.log(`Error connecting to ${process.env.awsserver} on thread: ${sqldb.threadId}`)
    console.log(err)
  } else {
    console.log(
      `Route = /indexRoute: Connected to ${process.env.awsserver} on thread: ${sqldb.threadId}`
    )
  }
})

appRouter.get("/", (req, res) => {
  const cookie = req.cookies
  if (cookie.c_auth != undefined) {
    console.log(`home dir: found cookie`)
    let getUser = `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(cookie.c_auth) + `LIMIT 1`
    sqldb.query(getUser, (err, result) => {
      if (err) {
        console.log("User not fetchs via cookie")
        return false
      }
      if (Object.keys(result).length != 0) {
        res.redirect(`/${result[0].username}`)
      } else {
        res.clearCookie("user") //fallback for old cookie
        res.clearCookie("c_auth")
        let nullUser = {}
        nullUser.appGlobal = req.appGlobal
        res.render("index", nullUser)
      }
    })
  } else {
    res.clearCookie("user") //fallback for old cookie
    res.clearCookie("c_auth")
    let nullUser = {}
    nullUser.appGlobal = req.appGlobal
    res.render("index", nullUser)
  }
})

//login
appRouter.get("/login", (req, res) => {
  if (req.cookies.c_auth) {
    res.clearCookie("c_auth")
  }
  //set goodwill to user
  let ref = {}
  ref.appGlobal = req.appGlobal
  res.render("login", ref)
})

//logout
appRouter.get("/logout", (req, res) => {
  if (req.cookies.c_auth) {
    res.clearCookie("c_auth")
  }
  res.redirect("/")
})

//signup
appRouter.get("/signup", (req, res) => {
  if (req.cookies.c_auth) {
    res.clearCookie("c_auth")
  }
  let ranUsername = localTools.randomInt()
  let possibleNames = [
    "ThinkingBanana",
    "Shombololation",
    "InspiredLaziness",
    "AngelicBurger",
    "Gossipcation",
    "IamCookingButter",
    "ProductiveMantis",
    "CompressedDodo",
    "BreadPrinting",
    "ThorsDadJokes",
  ]
  const newUser = {}
  newUser.ranUserName = possibleNames[ranUsername]
  newUser.appGlobal = req.appGlobal
  res.render("signup", newUser)
})

//settings
appRouter.get("/settings", (req, res) => {
  if (req.cookies.c_auth) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(req.cookies.c_auth) + `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        //set goodwill message
        returnedUser[0].appGlobal = req.appGlobal
        res.render("settings", returnedUser[0])
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("logout")
      }
    })
  } else {
    res.redirect("/")
  }
})

//about
appRouter.get("/about", (req, res) => {
  if (req.cookies.c_auth) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(req.cookies.c_auth) + `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        //set goodwill to user
        returnedUser[0].appGlobal = req.appGlobal
        res.render("about", returnedUser[0])
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("logout")
      }
    })
  } else {
    res.redirect("/")
  }
})

//statistics
appRouter.get("/statistics", (req, res) => {
  if (req.cookies.c_auth) {
    //set stat data
    const statData = {}
    //set goodwill message
    statData.appGlobal = req.appGlobal
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(req.cookies.c_auth) + `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        statData.owner = returnedUser[0]

        //get more stat data
        let countSub =
          `SELECT COUNT(ref) AS totalCount FROM subs WHERE username = ` +
          sqldb.escape(returnedUser[0].username)
        //get total sub cost and round up to 2 decimal points
        let countSubCost =
          `SELECT ROUND(SUM(cost), 2) AS totalCost FROM subs WHERE username = ` +
          sqldb.escape(returnedUser[0].username)
        let highestSub =
          `SELECT * FROM subs WHERE username = ` +
          sqldb.escape(returnedUser[0].username) +
          `ORDER BY CAST(cost AS DECIMAL) DESC LIMIT 1`
        let lowestSub =
          `SELECT * FROM subs WHERE username = ` +
          sqldb.escape(returnedUser[0].username) +
          `ORDER BY CAST(cost AS DECIMAL) ASC LIMIT 1`
        let getSubLedger =
          `SELECT * FROM ledger WHERE username = ` + sqldb.escape(returnedUser[0].username)
        //get total subs count
        sqldb.query(countSub, (err, resultCountSub) => {
          if (err) {
            console.log(err)
          }
          statData.count = resultCountSub[0].totalCount

          //only proceed to other metrics if sub exist
          if (statData.count > 0) {
            //get total cost of all active subs
            sqldb.query(countSubCost, (err, resultCountCostSub) => {
              if (err) {
                console.log(err)
              }
              statData.totalCost = resultCountCostSub[0].totalCost

              //get most expensive sub
              sqldb.query(highestSub, (err, resultHighestSub) => {
                if (err) {
                  console.log(err)
                }
                //get lowest sub
                sqldb.query(lowestSub, (err, resultLowestSub) => {
                  if (err) {
                    console.log(err)
                  }

                  //get all subs logged into the ledger history
                  sqldb.query(getSubLedger, (err, resultSubLegder) => {
                    if (err) throw err

                    if (Object.keys(resultSubLegder).length != 0) {
                      const billings = localTools.getArraySum(resultSubLegder)
                      statData.billings = billings
                    } else {
                      //set default values
                      const billing = {
                        costSum: 0,
                        costCount: 0,
                      }
                      statData.billings = billing
                    }
                    //define other obj and send
                    statData.bottomSub = resultLowestSub[0]
                    statData.topSub = resultHighestSub[0]
                    res.render("statistics", statData)
                  })
                })
              })
            })
          } else {
            //just render empty stat page
            res.render("statistics", statData)
          }
        })
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("/logout")
      }
    })
  } else {
    res.redirect("/")
  }
})

//leger
appRouter.get("/ledger", (req, res) => {
  if (req.cookies.c_auth) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(req.cookies.c_auth) + `LIMIT 1`
    var ledgerData = {}
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        ledgerData.owner = returnedUser[0]
        let getSubLedger =
          `SELECT * FROM ledger WHERE username = ` +
          sqldb.escape(returnedUser[0].username) +
          `ORDER BY dateEntered DESC`
        //get all subs logged iinto the ledger history
        sqldb.query(getSubLedger, (err, resultSubLegder) => {
          if (err) throw err
          if (Object.keys(resultSubLegder).length != 0) {
            ledgerData.ledger = resultSubLegder
            console.log(resultSubLegder)
          } else {
            console.log("no ledger data found")
          }
          ledgerData.appGlobal = req.appGlobal
          res.render("ledger", ledgerData)
        })
      } else {
        //no user found in db
        res.redirect("/")
      }
    })
  } else {
    //no cookie found
    const getUserError = {}
    getUserError.errReason = { msg: "No user found for logged in data" }
    getUserError.status = false
    res.redirect("/logout")
  }
})

//save or update new sub entry: /record
appRouter.post(
  "/record",
  //body("name", "Name is not valid").isAlphanumeric(body.name, "en-GB", { ignore: " " }),
  [
    check("cost", "Cost needs to be a number").isNumeric(),
    check("date", "Date should be calendar date").isInt(),
    //sanitise username...others
    check("action", "Action is not create").isIn(["create", "update"]),
  ],
  (req, res) => {
    //define login status handler
    const actionError = {}
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      actionError.errReason = reqErr.array()[0]
      actionError.errStatus = false
      res.send(actionError.errReason.msg)
      //redirect to sub individual view
    } else {
      //no error. proceed to creating sub
      let getUser =
        `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(req.cookies.c_auth) + `LIMIT 1`
      sqldb.query(getUser, (err, returnedUser) => {
        if (err) throw err
        if (Object.keys(returnedUser).length != 0) {
          //only enter a sub if a valid user is logged in
          let insertNewSub = `INSERT INTO subs SET ?`
          if (req.body.action == "create") {
            //generate a reference code and define other req values
            req.body.ref = localTools.randomValue(9)
            req.body.username = returnedUser[0].username
            delete req.body.action
            //default nextlog for legder processes
            if (req.body.frequency == "Every Week") {
              req.body.nextlog = req.body.date
            }
            var currentDate = new Date()
            req.body.created = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`
            sqldb.query(insertNewSub, req.body, (err, insertSubResult, fields) => {
              if (err) {
                actionError.errReason = err
                actionError.errStatus = false
                res.send(actionError.errReason)
              }
              if (insertSubResult.insertId != undefined) {
                res.redirect(`/sub/${req.body.ref}`)
              }
            })
          } else if (req.body.action == "update") {
            sqldb.query(
              "UPDATE subs SET name = ?, cost = ?, date = ?, frequency = ?, colour = ?, status = ? WHERE ref = ?",
              [
                `${req.body.name}`,
                `${req.body.cost}`,
                `${req.body.date}`,
                `${req.body.frequency}`,
                `${req.body.colour}`,
                `${req.body.status}`,
                `${req.body.ref}`,
              ],
              (err, updateSubResult) => {
                if (err) {
                  actionError.errReason = err
                  actionError.errStatus = false
                  res.send(actionError.errReason)
                  console.log(err)
                }
                res.redirect(`/sub/${req.body.ref}`)
              }
            )
          } else {
            //not updating, neither creating
          }
        } else {
          //no valid user logged in, cannot make a sub
          res.redirect("/")
        }
      })
    }
  }
)

//edit account
appRouter.get("/account", (req, res) => {
  if (req.cookies.c_auth) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` + sqldb.escape(req.cookies.c_auth) + `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        //set goodwill message
        returnedUser[0].appGlobal = req.appGlobal
        res.render("profile", returnedUser[0])
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("logout")
      }
    })
  } else {
    res.redirect("/")
  }
})

//profile
appRouter.get("/:username", (req, res) => {
  //set dependecies
  const cookie = req.cookies
  const paramUser = req.params.username

  //only show if user is logged in and sessioned
  if (paramUser && cookie.c_auth) {
    let getUser = `SELECT * FROM profiles WHERE username = ` + sqldb.escape(paramUser) + `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        //set user objct
        let user = returnedUser[0]
        //get users data from data table
        //set goodwill to user
        user.appGlobal = req.appGlobal
        let getUserSubs =
          `SELECT * FROM subs WHERE username = '${user.username}'` + `ORDER BY date ASC`
        sqldb.query(getUserSubs, (err, returnedSubs) => {
          if (err) throw err
          if (Object.keys(returnedSubs).length != 0) {
            //create a default total sub cost
            var totalSubCost = 0
            //get date to sub countdown and set for each sub
            returnedSubs.reduce(nextDate, 0)
            function nextDate(sum, sub) {
              sub.subFuture = localTools.dateToNextSub(sub)
              //create an opacity handler for inactive subs
              if (sub.status == "inactive") {
                sub.statusInactive = true
              } else {
                //update total sub costs only if sub is active
                totalSubCost += parseFloat(sub.cost)
              }
            }
            user.subsTotalled = totalSubCost.toLocaleString()
            user.subs = returnedSubs
            res.render("home", user)
          } else {
            //user has no subs yet
            res.render("home", user)
          }
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

module.exports = appRouter
