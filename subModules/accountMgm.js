
let isActiveCookie = (req, res, next) => {
  const cookie = req.cookies
	console.log(cookie._ga)
	if(cookie.user != undefined){
		console.log(`cookie user is ${cookie.user}`) 
		res.redirect("/")
		return false
	}
	next()
}

let urlLog = (req, res, next) => {
	let url = `${req.protocol}://${req.get("host")}${req.originalUrl}`
	console.log(`Content loaded from page: ${url}`)
	  next()
  }

module.exports = {isActiveCookie, urlLog}
