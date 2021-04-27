//Index. Rewuire and initialize Express server
const express = require("express")
const app = express()





//start server
const port = 1000
app.listen(port, ()=>{
    console.log(`\x1b[32m...Subs ready on port ${port}... \x1b[0m  \n`)
})