var vowelTotal = 0
let counter = (start, str) => {
  const vowels = "AEIOU"
  const count = vowels.indexOf(str)
  count > 0 ? vowelTotal++ : (vowelTotal = vowelTotal)
}
let assertVowels = ({ string, shouldBe }) => {
  const arrReq = string.toUpperCase().split("")
  arrReq.reduce(counter, 0)
  vowelTotal === shouldBe
    ? console.log(`\x1b[32m 1 Test Passed \x1b[0m`)
    : console.log(`\x1b[31m 1 Test Failed \x1b[0m`)
}

//why not chai!
assertVowels({
  string: "heloAEIOU",
  shouldBe: 6,
})

//someone needs to build this into a node package and extend it for consonants ;)
