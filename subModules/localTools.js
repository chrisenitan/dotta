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

  const todayYear = dateObj.getFullYear()
  const todayMonth = dateObj.getMonth()
  const todayDate = dateObj.getDate()
  const eventUTC = Date.UTC(date.year, date.month - 1, date.date)
  const todayUTC = Date.UTC(todayYear, todayMonth, todayDate)
  const eventDay = (eventUTC - todayUTC) / 1000 / 60 / 60 / 24
  if (eventDay < 0) result = 0
  else result = eventDay
  return result
}

exports.dateToNextSub = dateToNextSub
exports.secureKey = secureKey
exports.randomValue = randomValue
