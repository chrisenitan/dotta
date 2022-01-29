const localTools = require("../subModules/localTools")

let isActiveCookie = (req, res, next) => {
  const cookie = req.cookies
  console.log(cookie._ga)
  if (cookie.c_auth != undefined) {
    console.log(`isActiveCookie Triggered`)
  }
  next()
}

let cookieOnly = (req, res, next) => {
  req.cookies.c_auth != undefined
    ? (console.log(`page access granted on cookie c_auth`), next())
    : (console.log(`page access denied: auth is not set`), res.redirect("/"))
}

//logs the url and exports some app requirments
let urlLog = (req, res, next) => {
  let url = `${req.protocol}://${req.get("host")}${req.originalUrl}`
  console.log(`\x1b[34m Route hit: ${url} \x1b[0m`)
  //goodwill
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
  var appGlobal = {}
  Object.assign(appGlobal, {
    goodWill: gW[ranVal],
    assetVersion: "1.06",
    appVersion: "1.08",
    latestUpdate: "29 January 2022",
  })
  req.appGlobal = appGlobal
  next()
}

module.exports = { isActiveCookie, cookieOnly, urlLog }
