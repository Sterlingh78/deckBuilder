function showCards(deck) {
  const deckList = deck.deckList
  //console.log(deckList)
  let forestCount = 0
  let plainsCount = 0
  let mountainCount = 0
  let islandCount = 0
  let swampCount = 0

  // populate commander and deck details
  function showDetails(deck) {
    console.log(deck.commander)
    const drawer = document.querySelector(".menu")
    let imageURL
    let drawerString = ``

    if (deck.commander.image_uris) {
      imageURL = deck.commander.image_uris.normal
    } else if (deck.commander.card_faces) {
      imageURL = deck.commander.card_faces[0].image_uris.normal
    }
    if (deck.commander.name) {
      let cardCount = deck.deckList.length + 1
      drawerString = `<img class="rounded-xl" src="${imageURL}" />
      <h1 class="text-2xl font-bold m-2">${deck.commander.name}</h1>
      <p class="text-1xl font-bold m-2">Cards in Deck: ${cardCount}</p><div class="flex">
      <button class="btn btn-outline btn-success ml-1 w-1/2">
    $369</button>
      <button class="btn btn-primary ml-1 w-1/2">Export Deck</button></div>`
    } else {
      let cardCount = deck.deckList.length
      drawerString = `<h1 class="text-2xl font-bold m-2">Add Commander to See Stats</h1><p class="text-1xl font-bold m-2">Cards in Deck: ${cardCount}</p>`
    }
    drawer.innerHTML = drawerString
  }
  showDetails(deck)

  // Sort cards into categories

  const creatures = deckList.filter((card) => {
    if (
      card.type_line.includes("Creature") ||
      card.type_line.includes("Summon")
    ) {
      return true
    } else return false
  })
  const artifacts = deckList.filter((card) => {
    if (
      !card.type_line.includes("Creature") &&
      !card.type_line.includes("Land")
    ) {
      return card.type_line.includes("Artifact")
    }
  })
  const enchantments = deckList.filter((card) => {
    if (
      !card.type_line.includes("Creature") &&
      !card.type_line.includes("Artifact") &&
      !card.type_line.includes("Land")
    ) {
      return card.type_line.includes("Enchantment")
    }
  })
  const sorceries = deckList.filter((card) => {
    return card.type_line.includes("Sorcery")
  })
  const instants = deckList.filter((card) => {
    return card.type_line.includes("Instant")
  })
  const planeswalkers = deckList.filter((card) => {
    return card.type_line.includes("Planeswalker")
  })
  const lands = deckList.filter((card) => {
    if (!card.type_line.includes("Creature")) {
      return card.type_line.includes("Land")
    }
  })

  //populate creatures
  function populateCards(type, arr) {
    let categoryString = ``
    let container = document.querySelector("." + type)
    let card = document.querySelector("." + type + "Card")

    for (const card of arr) {
      const cardString = `<div id="${card.id}" class="cardDiv flex m-1 relative">
      <button class="cardName btn btn-block">
        ${card.name}
      </button>
     
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
        class="trashBtn btn btn-square btn-outline btn-error ml-1 hidden absolute border-hidden right-0"
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
      categoryString += cardString
    }
    container.innerHTML = categoryString
    //console.log(container.innerHTML == "")
    if (!container.innerHTML == "") {
      card.classList.remove("hidden")
    } else {
      card.classList.add("hidden")
    }
  }

  populateCards("creatures", creatures)
  populateCards("artifacts", artifacts)
  populateCards("enchantments", enchantments)
  populateCards("sorceries", sorceries)
  populateCards("instants", instants)
  populateCards("planeswalkers", planeswalkers)
  populateCards("lands", lands)

  // add delete event listeners
  document.querySelectorAll(".cardDiv").forEach((el) => {
    const cardName = el.childNodes[1]
    const trashBtn = el.childNodes[5]

    cardName.addEventListener("click", (event) => {
      const id = el.id

      localStorage.setItem("currentCard", id)
      window.location.href = `card.html`
    })
    el.addEventListener("mouseenter", (event) => {
      trashBtn.classList.remove("hidden")
    })
    el.addEventListener("mouseleave", (event) => {
      trashBtn.classList.add("hidden")
    })
    trashBtn.addEventListener("click", async (event) => {
      // make call to API to delete card from database
      const deckID = localStorage.getItem("currentDeck")
      await fetch("/deleteCard", {
        method: "POST",
        body: JSON.stringify({
          deckID: `${deckID}`,
          cardID: el.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((deck) => {
          showCards(deck)
        })
    })
  })

  /*
  console.log("Creatures:", creatures)
  console.log("Artifacts:", artifacts)
  console.log("Enchantments:", enchantments)
  console.log("Sorceries:", sorceries)
  console.log("Instants:", instants)
  console.log("Planeswalkers:", planeswalkers)
  console.log("Lands:", lands)*/
}

async function getCards() {
  const deckID = localStorage.getItem("currentDeck")
  await fetch("/getCards", {
    method: "POST",
    body: JSON.stringify({
      deckID: `${deckID}`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((deck) => {
      showCards(deck)
    })
}

getCards()
