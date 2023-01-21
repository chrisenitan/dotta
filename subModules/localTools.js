const { tools: tools } = require("./dataFactory")
//generate a random char: receives int param for length
let randomValue = (req) => {
  var ranId = ""
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
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
  var characters = "ABCTU$%VWXYZabcdewxyz012345fghijklmnopqrDEFGHIJMNOPQRSstuv67KL89!@#&*"
  for (var i = 0; i < req; i++) {
    ranKey += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return ranKey
}

//calculates the countdown to a sub and other progress rel data
let dateToNextSub = (req) => {
  const dateObj = new Date()
  let date = {}

  if (req.frequency == "Every Month") {
    date = { ...tools.dateForMonth(req) }
    date.date = parseInt(req.date)
    var monthDivisor = 30
    var percentDivisor = 3.34
  } else {
    date = { ...tools.dateForWeek(req) }
    var monthDivisor = 7
    var percentDivisor = 14.3
  }

  const eventDateNorm = `${date.date} ${tools.monthNames[date.month]} ${date.year}`
  const eventUTC = Date.UTC(date.year, date.month, date.date)
  const todayUTC = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  const eventDay = (eventUTC - todayUTC) / 1000 / 60 / 60 / 24
  const progressPercent = (parseFloat(percentDivisor) * parseFloat(monthDivisor - eventDay)).toFixed(2)

  const resolve = {
    daysRemaining: 0,
    nextDate: 0,
    progressPercent: 2,
    progressColor: "#88fa91",
    daysRemainingString: "days",
  }
  if (eventDay > 0) {
    Object.assign(resolve, {
      daysRemaining: eventDay,
      nextDate: eventDateNorm,
      progressPercent: progressPercent,
      progressColor: progressPercent <= 49 ? "#88fa91" : progressPercent <= 70 ? "#fad788" : progressPercent >= 71 ? "#fa8888" : "#88fa91",
      daysRemainingString: eventDay == 1 ? "day" : "days",
    })
  }
  return resolve
}

//receives an array of objects containing at least cost in prop
let getArraySum = (req) => {
  let costSum = 0
  for (let nulAmount = 0; nulAmount < req.length; nulAmount++) {
    costSum = costSum + parseFloat(req[nulAmount].cost)
  }
  let response = {}
  response.costSum = parseFloat(costSum.toFixed(2))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  response.costCount = req.length
  return response
}

module.exports = {
  dateToNextSub,
  secureKey,
  randomValue,
  randomInt,
  getArraySum,
  randomString,
}
