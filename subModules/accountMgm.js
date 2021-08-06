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
    "'I always want to know who billed me...'",
    "Constantly recurring outdoor lunch qualifies",
    "Annual income minus 9, minus 9, minus 9...",
    "Let's call it a calendar for subscriptions",
    "Rotate subscriptions as you need them",
    "That's how they get high on your supply",
    "It's one step closer to fixing addictions",
    "Pay less with family or broader plans",
    "Long list? Kill what you don't need",
    "Baby gels, shaving cream and nail polish",
  ]

  req.goodWill = gW[ranVal]
  next()
}

module.exports = { isActiveCookie, cookieOnly, urlLog }
