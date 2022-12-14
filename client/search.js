const searchInput = document.querySelector(".searchInput")
const searchBtn = document.querySelector(".searchBtn")
const landBtn = document.querySelector(".landBtn")

// add lands
landBtn.addEventListener("click", async (event) => {
  const modal = document.querySelector(".addLand")
  const landInput = document.querySelector(".landInput")
  const deckID = localStorage.getItem("currentDeck")

  modal.classList.remove("modal-open")

  await fetch("/addLands", {
    method: "POST",
    body: JSON.stringify({
      deckID: `${deckID}`,
      cardID: `${modal.id}`,
      count: `${landInput.value}`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((addedCard) => {
      console.log("Land added:", addedCard)
    })
})

// search function
searchBtn.addEventListener("click", async (event) => {
  await fetch(`/searchCards/`, {
    method: "POST",
    body: JSON.stringify({
      query: `${searchInput.value}`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((cardObj) => {
      console.log("Search Done:", cardObj.data)
      showCards(cardObj.data)
    })
})

// Page Build

function showCards(cardList) {
  //console.log(cardList)
  const cardContainer = document.querySelector(".cardContainer")
  cardContainer.innerHTML = ""

  let cardStrings = ``

  for (const card of cardList) {
    let imageURL
    if (card.image_uris) {
      imageURL = card.image_uris.normal
    } else if (card.card_faces) {
      imageURL = card.card_faces[0].image_uris.normal
    } else {
      imageURL = "./src/img/urza.jpeg"
    }
    let cardString = `<div class="cursor-pointer cardDiv w-64 m-2 relative">
    <a href='card.html'>
        <img
          src="${imageURL}"
          alt="Card"
          class="cardImg rounded-xl w-full"
        />
    </a>
      <label
      id="${card.id}" for="my-modal-4" class="addCard btn btn-square btn-secondary btn-outline border-hidden absolute top-10 left-6 hidden"
      >
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
      </label>
    </div>`

    cardStrings += cardString
  }
  cardContainer.innerHTML = cardStrings

  document.querySelectorAll(".cardDiv").forEach((el) => {
    //const cardImage = el.childNodes[1]
    const cardBtn = el.childNodes[3]
    const deckID = localStorage.getItem("currentDeck")

    // make add btn appear/disappear
    el.addEventListener("mouseenter", (event) => {
      cardBtn.classList.remove("hidden")
    })
    el.addEventListener("mouseleave", (event) => {
      cardBtn.classList.add("hidden")
    })
    el.addEventListener("click", (event) => {
      localStorage.setItem("currentCard", cardBtn.id)
    })
    // add basic lands
    cardBtn.addEventListener("click", async (event) => {
      for (const card of cardList) {
        if (cardBtn.id == card.id && card.type_line.includes("Basic Land")) {
          const modal = document.querySelector(".addLand")
          modal.id = `${cardBtn.id}`
          modal.classList.add("modal-open")
          return
        }
      }
      console.log(event.target)
      await fetch("/addCard", {
        method: "POST",
        body: JSON.stringify({
          deckID: `${deckID}`,
          cardID: `${cardBtn.id}`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((addedCard) => {
          console.log("Card Added:", addedCard)
        })
    })
  })
}
