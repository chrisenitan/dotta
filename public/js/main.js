//page features
const app = {
  openNewSubForm: () => {
    document.getElementById("addPanelForm").style.display = "block"
    const addPanel = document.getElementById("addPanel")
    addPanel.style.height = "70vh"
    addPanel.style.paddingTop = "2.5%"
    addPanel.style.paddingBottom = "2.5%"
  },

  closeNewSubForm: () => {
    document.getElementById("addPanelForm").style.display = "none"
    const addPanel = document.getElementById("addPanel")
    addPanel.style.height = "0vh"
    addPanel.style.paddingTop = "0.5%"
    addPanel.style.paddingBottom = "0.5%"
  },

  openRecoverAccountForm: () => {
    const loginForm = document.getElementById("loginForm")
    const recoverForm = document.getElementById("recoverFormDiv")
    loginForm.style.height = "0px"
    recoverForm.style.height = "100vh"
    document.getElementById("recoverForm").reset()
  },

  deleteSubscription: (event) => {
    if (confirm("sure to delete this subscription?") == false) event.preventDefault()
  },
}

//dom preparations values
const preloads = {
  navAdd: {
    id: "navAdd",
    type: "click",
    func: [app.openNewSubForm],
  },
  closeAddPanel: {
    id: "closeAddPanel",
    type: "click",
    func: [app.closeNewSubForm],
  },
  showRecoverForm: {
    id: "closeAddPanel",
    type: "click",
    func: [app.openRecoverAccountForm],
  },
  deleteSubButton: {
    id: "deleteSubButton",
    type: "click",
    func: [app.deleteSubscription],
  },
}

//add document background events
for (const [, value] of Object.entries(preloads)) {
  value.func.forEach((element) => {
    if (document.getElementById(value.id)) {
      document.getElementById(value.id).addEventListener(value.type, element, false)
    }
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

//control pause billing button on dom
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

  //match header color with device theme
  /*   if (document.getElementById("navHeader")) {
    const navHeader = document.getElementById("navHeader")
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? (navHeader.style.background = "linear-gradient(to top, #646464a1, #000000, #000000)")
      : (navHeader.style.backgroundColor = "#fff")
  } */
})
