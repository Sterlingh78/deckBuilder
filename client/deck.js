document.querySelectorAll(".cardDiv").forEach((el) => {
  const cardName = el.childNodes[1]
  const trashBtn = el.childNodes[5]
  //const deckID = localStorage.getItem("currentDeck")

  el.addEventListener("mouseenter", (event) => {
    trashBtn.classList.remove("hidden")
  })
  el.addEventListener("mouseleave", (event) => {
    trashBtn.classList.add("hidden")
  })
})
