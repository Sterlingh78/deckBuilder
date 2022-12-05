const addBtn = document.querySelector(".addBtn")

addBtn.addEventListener("click", (event) => {
  // take input from user to add new deck name. Make API call to make new deck, then display all decks from response
})

document.querySelectorAll(".deckDiv").forEach((el) => {
  const deckName = el.childNodes[1]
  const editBtn = el.childNodes[3]
  const trashBtn = el.childNodes[5]
  const parent = deckName.parentNode

  el.addEventListener("mouseenter", (event) => {
    deckName.classList.add("w-4/6")
    deckName.classList.remove("btn-block")
    trashBtn.classList.remove("hidden")
    trashBtn.classList.add("w-1/6")
    editBtn.classList.remove("hidden")
    editBtn.classList.add("w-1/6")
  })
  el.addEventListener("mouseleave", (event) => {
    deckName.classList.remove("w-4/6")
    deckName.classList.add("btn-block")
    trashBtn.classList.add("hidden")
    trashBtn.classList.remove("w-1/6")
    editBtn.classList.add("hidden")
    editBtn.classList.remove("w-1/6")
  })
  deckName.addEventListener("click", (event) => {
    // pass data via URL and navigate to deck list page
  })
  trashBtn.addEventListener("click", (event) => {
    // make call to API to delete deck from database
  })
  editBtn.addEventListener("click", (event) => {
    const inputString = `<input 
    type="text"
    placeholder="Type here"
    class="editInput input input-bordered input-md w-full"
    />`
    deckName.remove()
    parent.innerHTML = inputString

    const editInput = document.querySelector(".editInput")
    editInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        console.log(editInput.value)
        // use refresh deck list function, I put a whole page refresh as a placeholder
        location.reload()
      }
    })
  })
})
