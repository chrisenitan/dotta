
let counter = (start, alphChar) => {
  const vowels = "AEIOU"
  const count = vowels.indexOf(alphChar)
  count >= 0 ? (start++) : (start = start)
  return start
}
let assertVowels = ({ string, shouldBe }) => {
  const arrReq = string.toUpperCase().split("")
 var vowelTotal = arrReq.reduce(counter, 0)
  vowelTotal === shouldBe
    ? console.log(`\x1b[32m 1 Test Passed: Asserted ${shouldBe} is ${vowelTotal} \x1b[0m`)
    : console.log(`\x1b[31m 1 Test Failed: Expected ${shouldBe} to be ${vowelTotal} \x1b[0m`)
}

//why not chai!
assertVowels({
  string: "heloAEIOU",
  shouldBe: 7,
})

//someone needs to build this into a node package and extend it for consonants ;)
