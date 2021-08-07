const localTools = require("../subModules/localTools")

let isActiveCookie = (req, res, next) => {
  const cookie = req.cookies
  console.log(cookie._ga)
  if (cookie.user != undefined) {
    console.log(`isActiveCookie Triggered: cookie user is ${cookie.user}`)
  }
  next()
}

let cookieOnly = (req, res, next) => {
  const cookie = req.cookies
  console.log(cookie._ga)
  if (cookie.user != undefined) {
    console.log(`cookie user is ${cookie.user}`)
  } else {
    res.redirect("/")
  }
  next()
}

let urlLog = (req, res, next) => {
  let url = `${req.protocol}://${req.get("host")}${req.originalUrl}`
  console.log(`Content loaded from page: ${url}`)

  let ranVal = localTools.randomInt()
  let gW = [
    "I always want to know who billed me",
    "Recurring outdoor lunch qualifies",
    "The annual income -9, -9, -9...",
    "Call it a calendar for subscriptions",
    "Penny jar can pay the next Netflix",
    "Share your feedbacks via app settings",
    "One step closer to fixing addictions",
    "Pay less, use family or broader plans",
    "Long list? Kill what you don't need",
    "Baby gels, shaving cream and nail polish",
  ]

  req.goodWill = gW[ranVal]
  next()
}

module.exports = { isActiveCookie, cookieOnly, urlLog }
