document.querySelectorAll(".cardDiv").forEach((el) => {
  const cardName = el.childNodes[1]
  const trashBtn = el.childNodes[5]

  el.addEventListener("mouseenter", (event) => {
    trashBtn.classList.remove("hidden")
  })
  el.addEventListener("mouseleave", (event) => {
    trashBtn.classList.add("hidden")
  })
})

const deckID = localStorage.getItem("currentDeck")
console.log(deckID)
