const addAlert = document.querySelector(".addAlert")
document.querySelectorAll(".addCard").forEach((el) => {
  el.addEventListener("click", (event) => {
    addAlert.classList.remove("hidden")
    setTimeout(() => {
      addAlert.classList.add("hidden")
    }, 2000)
  })
})
