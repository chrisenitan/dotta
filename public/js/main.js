if (document.getElementById("navAdd")) {
  document.getElementById("navAdd").addEventListener("click", function () {
    document.getElementById("addPanelForm").style.display = "block"
    document.getElementById("addPanel").style.height = "65vh"
    document.getElementById("addPanel").style.paddingTop = "2.5%"
    document.getElementById("addPanel").style.paddingBottom = "2.5%"
  })
}
if (document.getElementById("closeAddPanel")) {
  document
    .getElementById("closeAddPanel")
    .addEventListener("click", function () {
      document.getElementById("addPanelForm").style.display = "none"
      document.getElementById("addPanel").style.height = "0vh"
      document.getElementById("addPanel").style.paddingTop = "0.5%"
      document.getElementById("addPanel").style.paddingBottom = "0.5%"
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
