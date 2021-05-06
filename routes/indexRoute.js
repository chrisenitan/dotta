const express = require("express")

const appRouter = express()

appRouter.get("/", (req, res)=>{
    res.render("index")
})

appRouter.get("/login", (req, res)=>{
    res.json({
        message: "login here wip"
    })
})

module.exports = appRouter;