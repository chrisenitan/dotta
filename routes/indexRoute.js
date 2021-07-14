const express = require("express")
const { check, validationResult, cookie } = require("express-validator")
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
    console.log(
      `Error connecting to ${process.env.awsserver} on thread: ${sqldb.threadId}`
    )
    console.log(err)
  } else {
    console.log(
      `Route = /indexRoute: Connected to ${process.env.awsserver} on thread: ${sqldb.threadId}`
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
  if (req.cookies.user) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` +
      sqldb.escape(req.cookies.user) +
      `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        res.render("settings", returnedUser[0])
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("logout")
      }
    })
  }
})

//about
appRouter.get("/about", (req, res) => {
  if (req.cookies.user) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` +
      sqldb.escape(req.cookies.user) +
      `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        res.render("about", returnedUser[0])
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("logout")
      }
    })
  }
})

//statistics
appRouter.get("/statistics", (req, res) => {
  if (req.cookies.user) {
    //set stat data
    const statData = {}
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` +
      sqldb.escape(req.cookies.user) +
      `LIMIT 1`
    sqldb.query(getUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        statData.owner = returnedUser[0]

        //get more stat data
        let countSub = `SELECT COUNT(ref) AS totalCount FROM subs WHERE username = ` + sqldb.escape(returnedUser[0].username)
        let countSubCost = `SELECT SUM(cost) AS totalCost FROM subs WHERE username = ` + sqldb.escape(returnedUser[0].username)
        //get totoal subs count
        sqldb.query(countSub, (err, resultCountSub) => {
          if (err) {
            console.log(err)
          }
          statData.count = resultCountSub[0].totalCount

          //get total subs cost
          sqldb.query(countSubCost, (err, resultCountCostSub) => {
            if (err) {
              console.log(err)
            }
            statData.totalCost = resultCountCostSub[0].totalCost
            console.log(statData)
            res.render("statistics", statData)
          })
        })
      } else {
        //no user found
        const getUserError = {}
        getUserError.errReason = { msg: "No user found for logged in data" }
        getUserError.status = false
        res.redirect("logout")
      }
    })
  }
})

//save or update new sub entry
appRouter.post(
  "/record",
  [
    check("name", "Name is not valid").isAlpha("en-GB", { ignore: " " }),
    check("cost", "Cost needs to be a number").isNumeric(),
    check("date", "Date should be calendar date").isDate(),
    //sanitise username...others
    check("action", "Action is not create").isIn(["create", "update"]),
    check("currency", "Currency is not valid").isIn(["$", "€", "₦"]),
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
      let insertNewSub = `INSERT INTO subs SET ?`
      if (req.body.action == "create") {
        //generate a reference code
        req.body.ref = localTools.randomValue(6)
        delete req.body.action
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
        console.log(req.body)
        sqldb.query(
          "UPDATE subs SET name = ?, cost = ?, currency = ?, date = ?, frequency = ?, logo = ? WHERE ref = ?",
          [
            `${req.body.name}`,
            `${req.body.cost}`,
            `${req.body.currency}`,
            `${req.body.date}`,
            `${req.body.frequency}`,
            `${req.body.logo}`,
            `${req.body.ref}`,
          ],
          (err, updateSubResult) => {
            if (err) {
              actionError.errReason = err
              actionError.errStatus = false
              res.send(actionError.errReason)
              console.log(err)
            }
            console.log(req.body.ref)
            console.log(updateSubResult)
            res.redirect(`/sub/${req.body.ref}`)
          }
        )
      } else {
        //do nothing catch errorr
      }
    }
  }
)

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
            //get date to sub countdown and set for all items
            for (let dateSub = 0; dateSub < returnedSubs.length; dateSub++) {
              returnedSubs[dateSub].daysRemaining = localTools.dateToNextSub(
                returnedSubs[dateSub].id
              )
            }
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
