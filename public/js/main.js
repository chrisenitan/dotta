if (document.getElementById("navAdd")) {
  document.getElementById("navAdd").addEventListener("click", function () {
    document.getElementById("addPanel").style.height = "65vh"
  })
}
if (document.getElementById("closeAddPanel")) {
  document
    .getElementById("closeAddPanel")
    .addEventListener("click", function () {
      document.getElementById("addPanel").style.height = "0vh"
    })
}
