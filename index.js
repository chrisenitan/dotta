//Index. Rewuire and initialize Express server
const express = require("express")
const {
  isActiveCookie,
  cookieOnly,
  urlLog,
} = require("./subModules/accountMgm")
const app = express()

//cookie parser
const cookieParser = require("cookie-parser")
app.use(cookieParser())

//dotenv file
require("dotenv").config()

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
app.use(express.urlencoded({ extended: true }))

//routes
const indexRoute = require("./routes/indexRoute")
app.use("/", urlLog, indexRoute)

//accounts route
const accountRoute = require("./routes/account")
app.use("/account", [isActiveCookie, urlLog], accountRoute)

//subs route
const subRoute = require("./routes/sub")
app.use("/sub", [cookieOnly, urlLog], subRoute)

//start server
app.listen(process.env.port, () => {
  console.log(
    `\x1b[32m...Subs ready on port ${process.env.port}... \x1b[0m  \n`
  )
})
