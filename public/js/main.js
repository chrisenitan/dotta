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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("../dottasw.js").then(
      function (registration) {
        console.log("Service-Worker Registered", registration.scope)
      },
      function (err) {
        console.log("Service-Worker Not Registered", err)
      }
    )
  })
}
