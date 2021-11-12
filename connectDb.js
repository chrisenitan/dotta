const mysql = require("mysql")
if (process.env.appEnvironment == "production") {
  var sqldb = mysql.createPool({
    connectionLimit: 10,
    host: process.env.awsserver,
    port: process.env.awsport,
    user: process.env.awsuser,
    password: process.env.awspass,
    database: process.env.awsdb,
  })
} else {
  var sqldb = mysql.createPool({
    connectionLimit: 10,
    host: process.env.stagingAwsserver,
    port: process.env.awsport,
    user: process.env.awsuser,
    password: process.env.stagingAwspass,
    database: process.env.awsdb,
  })
}

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
    console.log(
      `\x1b[34mEnvironment:\x1b[0m ${process.env.appEnvironment}\n\x1b[34mEndpoint:\x1b[0m ${process.env.awsserver} \n\x1b[34mThread:\x1b[0m ${connection.threadId}`
    )
  }
  if (connection) connection.release()
  return
})

module.exports = sqldb
