const express = require("express")

const appRouter = express()

appRouter.get("/", (req, res)=>{
    res.render("index")
})

//login
appRouter.get("/login", (req, res)=>{
    res.render("login")
})

//signup
appRouter.get("/signup", (req, res)=>{
    res.render("signup")
})

module.exports = appRouter;