var number = 0
function counter(sum, sub) {
  const vowels = "AEIOU"
  const pp = vowels.indexOf(sub)
  if (pp > 0) {
    number++
  }
}
function countVowels(req) {
  const upperReq = req.toUpperCase()
  const arrReq = upperReq.split("")
  arrReq.reduce(counter, 0)
  console.log(number)
}
countVowels("heloAEIOU")

//expect...
