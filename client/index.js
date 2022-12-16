//Event Handling and Page Build

async function showDeckList(deckList) {
  console.log(deckList)

  const deckContainer = document.querySelector(".card-body")
  const decks = document.querySelectorAll(".deckDiv")

  deckContainer.innerHTML = ""
  let headerString = `<div class="flex">
  <button class="addBtn btn btn-square btn-outline btn-secondary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="currentColor"
    >
      <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
    </svg>
  </button>
  <input
    type="text"
    placeholder="Add new deck..."
    class="newDeckInput input input-bordered input-secondary ml-2"
  />
</div>`

  for (const deck of deckList) {
    const deckString = `<div class="deckDiv flex">
    <button id="${deck._id}" class="deckName btn btn-block">${deck.name}</button>
    <button class="editBtn btn btn-square btn-outline ml-1 hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="currentColor"
      >
        <path
          d="M16.598 13.091l-5.69-5.688 7.402-7.403 5.69 5.689-7.402 7.402zm-16.598 10.909l7.126-1.436-5.688-5.689-1.438 7.125zm1.984-20.568l6.449 6.446-5.582 5.582 5.689 5.69 5.583-5.583 6.492 6.49 1.4-1.428-18.631-18.625-1.4 1.428z"
        />
      </svg>
    </button>
    <button
      class="trashBtn btn btn-square btn-outline btn-error ml-1 hidden"
    >
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        stroke="currentColor"
        fill="currentColor"
      >
        <path
          d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z"
        />
      </svg>
    </button>
  </div>`

    headerString += deckString
  }

  deckContainer.innerHTML = headerString

  const addBtn = document.querySelector(".addBtn")
  const newDeckInput = document.querySelector(".newDeckInput")

  addBtn.addEventListener("click", (event) => {
    // take input from user to add new deck name. Make API call to make new deck, then display all decks from response
    if (newDeckInput.value !== "") {
      fetch("/addNewDeck", {
        method: "POST",
        body: JSON.stringify({
          deckName: `${newDeckInput.value}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((deckList) => {
          showDeckList(deckList)
        })
    }
  })

  document.querySelectorAll(".deckDiv").forEach((el) => {
    const deckName = el.childNodes[1]
    const editBtn = el.childNodes[3]
    const trashBtn = el.childNodes[5]
    const parent = deckName.parentNode

    // toggle trash and edit btns
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
      localStorage.clear()
      localStorage.setItem("currentDeck", deckName.id)
      window.location.href = `deck.html`
    })
    trashBtn.addEventListener("click", (event) => {
      // make call to API to delete deck from database
      fetch(`/deleteDeck/${deckName.innerText}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((deckList) => {
          showDeckList(deckList)
        })
    })
    editBtn.addEventListener("click", (event) => {
      const inputString = `<input 
    type="text"
    placeholder="${deckName.innerText}"
    class="editInput input input-bordered input-md w-full"
    />`
      deckName.remove()
      parent.innerHTML = inputString

      const editInput = document.querySelector(".editInput")
      editInput.addEventListener("keypress", async (event) => {
        if (event.key === "Enter") {
          console.log(editInput.value)

          fetch("/editDeck/", {
            method: "PUT",
            body: JSON.stringify({
              placeholder: `${editInput.placeholder}`,
              value: `${editInput.value}`,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((deckList) => {
              showDeckList(deckList)
            })
          // use refresh deck list function
        }
      })
    })
  })
}

// API Calls

async function getDeckList() {
  const response = await fetch("/getDeckList")
  const data = await response.json()
  return data
}
getDeckList().then((deckList) => {
  showDeckList(deckList)
})
