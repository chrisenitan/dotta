//Index. Rewuire and initialize Express server
const express = require("express")
const app = express()

//cookie parser
const cookieParser = require("cookie-parser")
app.use(cookieParser())

//dotenv file
require("dotenv").config();

//views default
const path = require("path")
app.set("views", path.join(__dirname, "views"))

//mustache
app.set("view engine", "mustache")
app.engine("mustache", require("hogan-middleware").__express)

//public files
app.use(express.static(path.join(__dirname, "public")))

//express form parser
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes
const indexRoute = require("./routes/indexRoute")
app.use("/", indexRoute)




//start server
const port = 1000
app.listen(port, ()=>{
    console.log(`\x1b[32m...Subs ready on port ${port}... \x1b[0m  \n`)
})