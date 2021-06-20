/* const mysql = require("mysql")

//set mysql
const db = mysql.createConnection({
  host: process.env.gcpserver,
  user: process.env.gcpuser,
  password: process.env.gcppass,
  database: process.env.gcpdb,
})
//connect mysql
db.connect((err) => {
  if (err) {
    throw err
  }
  console.log(
    `Route = /account: Linked to ${process.env.gcpserver} on thread: ${db.threadId}`
  )
}) */

let currentCookie = (req, res, next) => {
  let url = `${req.protocol}://${req.get("host")}${req.originalUrl}`
  /* if (req.cookies.user) {
    let goToUser =
      `SELECT * FROM profiles WHERE cookie = ` +
      db.escape(req.cookies.user) +
      `LIMIT 1`
    db.query(goToUser, (err, returnedUser) => {
      if (err) throw err
      if (Object.keys(returnedUser).length != 0) {
        res.redirect(`/${returnedUser.cookie}`)
      } else {
        //cookie not valid. lcear user
        //res.clearCookie("user")
        res.redirect("/login")
      }
    })
  }
	else {
    //do nothing
  } */
  console.log(`Content loaded from page: ${url}`)
  next()
}

module.exports = currentCookie
