const express = require("express")

const appRouter = express()

appRouter.get("/", (req, res)=>{
    res.json({
        message: "lo"
    })
})

appRouter.get("/login", (req, res)=>{
    res.json({
        message: "login here"
    })
})

module.exports = appRouter;