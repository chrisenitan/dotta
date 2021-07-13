
//generate a random char: recieves int param for lenght
let randomValue = (req)=>{
    var ranId = ""
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	for(var i = 0; i < req; i++){
		ranId += characters.charAt(Math.floor(Math.random() * characters.length))
	}
    return ranId
    
}

let secureKey = (req)=>{
    var ranKey = ""
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"
	for(var i = 0; i < req; i++){
		ranKey += characters.charAt(Math.floor(Math.random() * characters.length))
	}
    return ranKey
    
}

let dateToNextSub = (req)=>{
    var ranKey = req + 2 + " days"
    return ranKey
    
}

exports.dateToNextSub = dateToNextSub
exports.secureKey = secureKey
exports.randomValue = randomValue