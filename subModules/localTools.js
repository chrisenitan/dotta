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
	for(var i = 0; i < 8; i++){
		ranKey += characters.charAt(Math.floor(Math.random() * characters.length))
	}
    return ranKey
    
}

exports.secureKey = secureKey
exports.randomValue = randomValue