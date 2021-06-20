const express = require("express")
const { cookie } = require("express-validator")

const appRouter = express()


appRouter.get("/", (req, res) => {
  const cookie = req.cookies
  if(cookie.user != undefined){
		console.log(`home dir: found cookie: ${cookie.user}`) 
    res.clearCookie("user")//for now
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
  //get account via cookie or via req
  console.log("/username hit")
  //checko for cookie
  if (req.cookies.user) {
    //cookie exists. go get name from db

  } else {
    //no cookie, just set a name to get from db
  }

  if(createAccount == true){
  //no cookie. login via db
  const user = {}
  user.username = req.params.username
  res.render("profile", user)
  }else{
    //send no data somewhere 
    return false
  }
  
})

module.exports = appRouter
