const localTools = require("../subModules/localTools")

let isActiveCookie = (req, res, next) => {
  const cookie = req.cookies
  console.log(cookie._ga)
  if (cookie.user != undefined) {
    console.log(`cookie user is ${cookie.user}`)
    res.redirect("/")
    return false
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
    "They want a piece of me, let me know it",
    "Money, service, control your spending",
    "Yeah! You! You didn't need to sign up for that",
    "That's how they get high on your supply",
    "It's one step closer to fixing addictions",
    ".99 is a lot of money if you think about it",
    "This list should be getting smaller!",
    "I give up, what do you want from me",
  ]

  req.goodWill = gW[ranVal]
  next()
}

module.exports = { isActiveCookie, cookieOnly, urlLog }
