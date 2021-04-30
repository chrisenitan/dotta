const express = require("express")

const appRouter = express()

appRouter.post("/login", (req, res)=>{
    res.json({
        message: "login here"
    })
})

module.exports = appRouter;