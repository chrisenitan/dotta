const express = require("express")
const mysql = require("mysql")
const appRouter = express()
const { check, validationResult, cookie } = require("express-validator")
const localTools = require("../subModules/localTools")
const fs = require("fs")

//set mysql data
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
    `Route = /account: Connected to ${process.env.awsserver} on thread: ${sqldb.threadId}`
  )
})

//magic mode: insert new account reuse
var insertNewAccount = function (req) {
  const reqUser = req

  //create other needed data
  let ranCookie = localTools.secureKey(28)
  req.cookie = ranCookie

  //use those to create account
  let trialSignUp = `INSERT INTO profiles SET ?`
  sqldb.query(trialSignUp, reqUser, (err, signupResult, fields) => {
    if (err) {
      console.log("Errorr inserting new user")
    }
    if (signupResult.insertId != undefined) {
      console.log("New user created")
    }
  })

  //strip secure dtat here first... wip

  return req
}

//trial sign up
appRouter.get("/trial", (req, res) => {
  //clear existing cookie
  res.clearCookie("c_auth")
  //reload of this url should not resignup. app makes sure cookie logeed in is redirected

  let ranUsername = localTools.randomString(6)
  let ranPassword = localTools.secureKey(6)

  //give rand name and acct values
  var userData = {}
  userData.password = ranPassword
  userData.username = `test${ranUsername}`
  userData.currency = "$"

  let createUser = insertNewAccount(userData)
  //set client cookie
  res.cookie("c_auth", createUser.cookie, {
    maxAge: 2592000000,
    httpOnly: false,
  })
  res.redirect("/account")
})

//login
appRouter.post(
  "/login",
  [check("action", "Action is not login").equals("logIn")],
  (req, res) => {
    //clear existing cookie
    res.clearCookie("c_auth")

    //define login status handler
    const loginError = {}
    //check validation result
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      //return res.status(400).json({ errors: reqErr.array() })
      loginError.errReason = reqErr.array()[0]
      loginError.errStatus = false
      res.render("login", loginError)
    } else {
      let loginUser =
        `SELECT * FROM profiles WHERE username = ` +
        sqldb.escape(req.body.username) +
        ` AND password = ` +
        sqldb.escape(req.body.password) +
        `LIMIT 1`
      sqldb.query(loginUser, (err, returnedUser) => {
        if (err) throw err
        if (Object.keys(returnedUser).length != 0) {
          //user found, set new cookie
          res.cookie("c_auth", returnedUser[0].cookie, {
            maxAge: 2592000000,
            httpOnly: false,
          })
          console.log(returnedUser[0])
          res.redirect(`/${returnedUser[0].username}`)
        } else {
          //no user found
          loginError.errReason = { msg: "No user found for that username" }
          loginError.status = false
          res.render("login", loginError)
        }
      })
    }
  }
)

//sign up or update account
appRouter.post(
  "/signup",
  //do some form sanitisation. need a module
  [
    check("username", "Name should not have spaces").isAlpha("en-US"),
    check("action", "Action is not create").isIn(["signUp", "update"]),
  ],
  (req, res) => {
    //get request body
    let signUpData = req.body
    //define account creation status object
    const signupError = {}

    //check for express validations
    const reqErr = validationResult(req)
    if (!reqErr.isEmpty()) {
      signupError.errReason = reqErr.array()[0]
      signupError.errStatus = false
      res.render("signup", signupError)
    } else {
      //check for old usernames
      let checkForUniqueuserName =
        `SELECT * FROM profiles WHERE username = ` +
        sqldb.escape(signUpData.username) +
        `LIMIT 1`
      //register user if registration is reqested and remove defaul action
      if (req.body.action == "signUp") {
        delete req.body.action
        sqldb.query(checkForUniqueuserName, (err, result) => {
          if (err) throw err
          if (Object.keys(result).length == 0) {
            var createUser = {}
            //user never existed so safe to insert
            createUser = insertNewAccount(signUpData)
            //set client cookie
            res.cookie("c_auth", createUser.cookie, {
              maxAge: 2592000000,
              httpOnly: false,
            })
            res.redirect("/account")
          }
          //found existing user, do not register
          else {
            signupError.errStatus = false
            signupError.errReason = { msg: "Name has already been registered" }
            res.render("signup", signupError)
          }
        })
      }
      //update user if update is reqested and remove default action
      else {
        delete req.body.action
        sqldb.query(
          "UPDATE profiles SET currency = ?, email = ?, password = ? WHERE username = ?",
          [
            `${req.body.currency}`,
            `${req.body.email}`,
            `${req.body.password}`,
            `${req.body.username}`,
          ],
          (err, updateSubResult) => {
            if (err) {
              console.log("error updating user")
              res.send("error updating")
            }
            console.log("Hit endpoint step")
            res.redirect("../account")
          }
        )
      }
    }
  }
)

//take out
appRouter.get("/takeout", (req, res) => {
  //only if user is logged in
  const cookie = req.cookies
  if (cookie.c_auth) {
    //get user data
    let getUser =
      `SELECT * FROM profiles WHERE cookie = ` +
      sqldb.escape(cookie.c_auth) +
      `LIMIT 1`
    sqldb.query(getUser, (err, resultUser) => {
      if (err) {
        console.log("User not fetched via cookie")
        return false
      }
      if (Object.keys(resultUser).length != 0) {
        const takeoutUser = resultUser[0]

        //get user subs
        let getUserSubs = `SELECT * FROM subs WHERE username = '${takeoutUser.username}'`
        sqldb.query(getUserSubs, (err, resultUserSubs) => {
          if (err) throw err
          if (Object.keys(resultUserSubs).length != 0) {
            takeoutUser.subscriptions = resultUserSubs
            console.log(takeoutUser)
          }
          //get user ledger
          let getUserLegder = `SELECT * FROM ledger WHERE username = '${takeoutUser.username}'`
          sqldb.query(getUserLegder, (err, resultUserLegder) => {
            if (err) throw err
            if (Object.keys(resultUserLegder).length != 0) {
              takeoutUser.ledger = resultUserLegder
              console.log(takeoutUser)
            }

            //file management
            const stTakeoutUser = JSON.stringify(takeoutUser)
            //create a new takeout file
            fs.appendFile(
              `assets/tmp_takeout/${takeoutUser.username}.json`,
              `${stTakeoutUser}`,
              function (err) {
                if (err) throw err
                //read file created
                fs.readFile(
                  `assets/tmp_takeout/${takeoutUser.username}.json`,
                  { encoding: "utf-8" },
                  function (err, file) {
                    if (err) throw err
                    res.writeHead(200, {
                      "Content-Type": "text/json",
                      "Content-Disposition": `attachment;filename=${takeoutUser.username}.json`,
                    })
                    res.write(file)
                    //delete file when done: maybe wait?
                    fs.unlink(
                      `assets/tmp_takeout/${takeoutUser.username}.json`,
                      function (err) {
                        if (err) throw err
                      }
                    )
                    res.end()
                  }
                )
              }
            )
          })
        })
      }
      //did not find user
      else {
        resultUser[0].goodWill = "Could not generate, please contact team"
        res.render("profile", resultUser[0])
      }
    })
  }
  //no cookie, this should not happen
  else {
    res.redirect("/")
  }
})

//delete an account
appRouter.post(
  "/delete",
  [check("action", "Action is not a deletion").equals("delete")],
  (req, res) => {
    //clear existing cookie
    res.clearCookie("c_auth")
    let actionUser = req.body
    let deleteUser =
      `DELETE FROM profiles WHERE username = ` +
      sqldb.escape(actionUser.username) +
      `LIMIT 1`

    let deleteUserSub =
      `DELETE FROM subs WHERE username = ` + sqldb.escape(actionUser.username)

    let deleteUserLedger =
      `DELETE FROM ledger WHERE username = ` + sqldb.escape(actionUser.username)

    //start deletion
    //user
    sqldb.query(deleteUser, (err, resDeleteUser) => {
      if (err) {
        console.log(err)
        return false
      }
      if (Object.keys(resDeleteUser).length != 0) {
        //if user deleted, do deletion: user subs
        sqldb.query(deleteUserSub, (err, resDeleteUserSub) => {
          if (err) throw err
        })
        //if user deleted, do deletion: user ledger
        sqldb.query(deleteUserLedger, (err, resDeleteUserLedger) => {
          if (err) throw err
        })
        res.redirect("/")
      } else {
        res.send("There was an error deleting the user")
      }
    })
  }
)

//all recovery of account
appRouter.get("/recovery", (req, res) => {
  res.json({
    message: "recover account here",
  })
})

module.exports = appRouter
