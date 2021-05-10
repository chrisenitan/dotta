const express = require("express")

const appRouter = express()

appRouter.get("/", (req, res)=>{
    res.render("index")
})

appRouter.get("/login", (req, res)=>{
    res.render("login")
})

module.exports = appRouter;