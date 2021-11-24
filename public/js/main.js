//open sub adding panel
if (document.getElementById("navAdd")) {
  document.getElementById("navAdd").addEventListener("click", function () {
    document.getElementById("addPanelForm").style.display = "block"
    const addPanel = document.getElementById("addPanel")
    //addPanel.style.width = "370px"
    addPanel.style.height = "70vh"
    //addPanel.style.padding = "2.5%"
    addPanel.style.paddingTop = "2.5%"
    addPanel.style.paddingBottom = "2.5%"
  })
}

//close sub adding panel
if (document.getElementById("closeAddPanel")) {
  document.getElementById("closeAddPanel").addEventListener("click", function () {
    document.getElementById("addPanelForm").style.display = "none"
    const addPanel = document.getElementById("addPanel")
    addPanel.style.height = "0vh"
    addPanel.style.paddingTop = "0.5%"
    addPanel.style.paddingBottom = "0.5%"
  })
}

if (document.getElementById("showRecoverForm")) {
  document.getElementById("showRecoverForm").addEventListener("click", function () {
    const loginForm = document.getElementById("loginForm")
    const recoverForm = document.getElementById("recoverFormDiv")
    loginForm.style.height = "0px"
    recoverForm.style.height = "100vh"
    document.getElementById("recoverForm").reset()
  })
}

//install service worker
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

//window listener
window.addEventListener("load", function () {
  //control edit sub status 
  if (document.getElementById("pauseBilling")) {
    const playPauseButton = document.getElementById("pauseBilling")
    const status = document.getElementById("status")
    //update visual user default
    if (status.value == "active") {
      checked.style.display = "none"
      unchecked.style.display = "block"
    } else {
      checked.style.display = "block"
      unchecked.style.display = "none"
    }
    //handle status changes
    playPauseButton.addEventListener("click", function () {
      const checked = document.getElementById("checked")
      const unchecked = document.getElementById("unchecked")
      if (status.value == "active") {
        checked.style.display = "block"
        unchecked.style.display = "none"
        status.value = "inactive"
      } else {
        checked.style.display = "none"
        unchecked.style.display = "block"
        status.value = "active"
      }
    })
  }
  
  //match header colour with device theme
  /*   if (document.getElementById("navHeader")) {
    const navHeader = document.getElementById("navHeader")
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? (navHeader.style.background = "linear-gradient(to top, #646464a1, #000000, #000000)")
      : (navHeader.style.backgroundColor = "#fff")
  } */
})
