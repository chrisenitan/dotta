const fs = require("fs")

//generate a random char: recieves int param for lenght
let randomValue = (req) => {
  var ranId = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < req; i++) {
    ranId += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return ranId
}

let randomString = (req) => {
  var ranSt = ""
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  for (var i = 0; i < req; i++) {
    ranSt += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return ranSt
}

let randomInt = () => {
  var ranInt = ""
  var numbers = "0123456789"
  for (var i = 0; i < 1; i++) {
    ranInt += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  return ranInt
}

let secureKey = (req) => {
  var ranKey = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"
  for (var i = 0; i < req; i++) {
    ranKey += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return ranKey
}

let dateToNextSub = (req) => {
  const dateObj = new Date()
  //instatiate req obj
  let date = {}
  date.year = dateObj.getFullYear()

  switch (req.frequency) {
    case "Every Month":
      //push to next month only if deadline has passed
      if (req.date <= dateObj.getDate()) {
        date.month = dateObj.getMonth() + 2
      } else {
        date.month = dateObj.getMonth() + 1
      }
      date.date = parseInt(req.date)
      break
    case "Every Week":
      date.month = dateObj.getMonth() + 1
      date.date = dateObj.getDate() + 7
      break

    default:
      date.month = dateObj.getMonth()
      date.date = dateObj.getDate()
  }

  const eventDateNorm = `${date.date}-${date.month}-${date.year}`
  const todayYear = dateObj.getFullYear()
  const todayMonth = dateObj.getMonth()
  const todayDate = dateObj.getDate()
  const eventUTC = Date.UTC(date.year, date.month - 1, date.date)
  const todayUTC = Date.UTC(todayYear, todayMonth, todayDate)
  const eventDay = (eventUTC - todayUTC) / 1000 / 60 / 60 / 24
  const result = {}
  if (eventDay < 0) {
    result.daysRemaining = 0
    result.nextDate = 0
  } else {
    result.daysRemaining = eventDay
    result.nextDate = eventDateNorm
  }
  return result
}

let getArraySum = (req) => {
  let costSum = 0
  for (let nulAmount = 0; nulAmount < req.length; nulAmount++) {
    costSum = costSum + parseFloat(req[nulAmount].cost)
  }
  let response = {}
  response.costSum = costSum.toFixed(2)
  response.costCount = req.length
  return response
}


exports.dateToNextSub = dateToNextSub
exports.secureKey = secureKey
exports.randomValue = randomValue
exports.randomInt = randomInt
exports.getArraySum = getArraySum
exports.randomString = randomString
