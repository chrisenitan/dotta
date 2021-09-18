//generate a random char: recieves int param for lenght
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

let dateToNextSub = (req) => {
  const dateObj = new Date()
  //instatiate req obj
  let date = {}
  date.year = dateObj.getFullYear()

  switch (req.frequency) {
    case "Every Month":
      //push to next month only if deadline has passed
      req.date <= dateObj.getDate()
        ? (date.month = dateObj.getMonth() + 2)
        : //same month but in a few days
          (date.month = dateObj.getMonth() + 1)
      date.date = parseInt(req.date)
      var monthDivisor = 30
      var percentDivisor = 3.34
      break
    case "Every Week":
      date.month = dateObj.getMonth() + 1
      date.date = parseInt(req.date) + 7
      while (date.date <= dateObj.getDate()) {
        date.date = date.date + 7
      }
      var monthDivisor = 7
      var percentDivisor = 14.3
      break

    default:
      date.month = dateObj.getMonth()
      date.date = dateObj.getDate()
  }
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const eventDateNorm = `${date.date} ${monthNames[date.month - 1]} ${date.year}`
  const todayYear = dateObj.getFullYear()
  const todayMonth = dateObj.getMonth()
  const todayDate = dateObj.getDate()
  const eventUTC = Date.UTC(date.year, date.month - 1, date.date)
  const todayUTC = Date.UTC(todayYear, todayMonth, todayDate)
  const eventDay = (eventUTC - todayUTC) / 1000 / 60 / 60 / 24
  var progressPercent = (parseFloat(percentDivisor) * parseFloat(monthDivisor - eventDay)).toFixed(
    2
  )
  //interprete progress color
  var progressColor = ""
  progressPercent <= 49
    ? (progressColor = "#88fa91")
    : progressPercent <= 70
    ? (progressColor = "#fad788")
    : progressPercent >= 71
    ? (progressColor = "#fa8888")
    : (progressColor = "#88fa91")
  //define final response
  const result = {}
  eventDay < 0
    ? Object.assign(result, {
        daysRemaining: 0,
        nextDate: 0,
        progressPercent: 2,
        progressColor: "#88fa91",
      })
    : Object.assign(result, {
        daysRemaining: eventDay,
        nextDate: eventDateNorm,
        progressPercent: progressPercent,
        progressColor: progressColor,
      })
  return result
}

let getArraySum = (req) => {
  let costSum = 0
  for (let nulAmount = 0; nulAmount < req.length; nulAmount++) {
    costSum = costSum + parseFloat(req[nulAmount].cost)
  }
  let response = {}
  response.costSum = costSum.toFixed(2) //round up to 2 decimal
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
