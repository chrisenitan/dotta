const mysql = require("mysql")
var sqldb = mysql.createPool({
  connectionLimit: 10,
  host: process.env.awsserver,
  port: process.env.awsport,
  user: process.env.awsuser,
  password: process.env.awspass,
  database: process.env.awsdb,
})
sqldb.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.")
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.")
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.")
    }
  } else {
    console.log(`DB Connected to ${process.env.awsserver} on thread: ${connection.threadId}`)
  }
  if (connection) connection.release()
  return
})

module.exports = sqldb
