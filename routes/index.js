const express = require("express")

const appRouter = express()

appRouter.get("/", (req, res)=>{
    res.json({
        message: "lo"
    })
})

module.exports = appRouter;