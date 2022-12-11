function showCardData(card) {
  console.log(card)
  let imageURL
  let cardString
  let cardText = ""
  let tcgURL = ""
  let scryfallURL = ""

  if (card.oracle_text) {
    cardText = card.oracle_text
  }
  if (card.purchase_uris) {
    tcgURL = card.purchase_uris.tcgplayer
  }
  if (card.scryfall_uri) {
    scryfallURL = card.scryfall_uri
  }
  if (card.image_uris) {
    imageURL = card.image_uris.normal

    cardString = `<div class="mx-auto w-1/2 card card-side bg-base-100 shadow-xl">
   
      <img class="w-80 rounded-2xl m-4" src="${imageURL}" alt="Movie" />
   
    <div class="card-body">
      <h2 class="card-title">${card.name}</h2>
      <p>${cardText}</p>
      <div>
        <a href="${tcgURL}"><button class="btn btn-primary">Buy</button></a>
        <a href="${scryfallURL}"><button class="btn btn-primary">Scryfall</button></a>
      </div>
    </div>
  </div>`
  } else if (card.card_faces) {
    let imageURL0 = card.card_faces[0].image_uris.normal
    let imageURL1 = card.card_faces[1].image_uris.normal
    let face1Name = card.card_faces[0].name
    let face2Name = card.card_faces[1].name
    let face1Text = card.card_faces[0].oracle_text
    let face2Text = card.card_faces[1].oracle_text

    cardString = `<div class="mx-auto card card-side bg-base-100 shadow-xl">
   
      <img class="w-80 rounded-2xl m-4" src="${imageURL0}" alt="Movie" />
   
  
      <img class="w-80 rounded-2xl m-4" src="${imageURL1}" alt="Movie" />
  
    <div class="card-body">
      <h2 class="card-title">${face1Name}</h2>
      <p>${face1Text}</p>
      <h2 class="card-title">${face2Name}</h2>
      <p>${face2Text}</p>
      <div>
        <a href="${tcgURL}"><button class="btn btn-primary">Buy</button></a>
        <a href="${scryfallURL}"><button class="btn btn-primary">Scryfall</button></a>
      </div>
    </div>
  </div>`
  } else {
    imageURL = "./src/img/urza.jpeg"
  }
  const container = document.querySelector(".cardContainer")
  container.innerHTML = cardString
}

async function showCard() {
  const cardID = localStorage.getItem("currentCard")
  console.log(cardID)
  fetch(`/getCard/`, {
    method: "POST",
    body: JSON.stringify({
      cardID: `${cardID}`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((card) => {
      console.log(card)
      showCardData(card)
    })
}

showCard()
