require("dotenv").config()
import fetch from "node-fetch"
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const deck = require("./models/deck")
const app = express()
//const port = process.env.PORT
const port = 8000

app.use(express.static("client"))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

mongoose.connect(
  `mongodb+srv://sterlingh78:${process.env.MONGO_PASS}@cluster0.x0kjapb.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
)
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Database Connected"))

async function getDeckList(res) {
  try {
    const deckList = await deck.find()
    res.json(deckList)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Scryfall API Calls

app.post("/searchCards/", async (req, res) => {
  const query = req.body.query
  searchCards(query).then((data) => {
    res.json(data)
  })
})

async function searchCards(query) {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/search?order=name&q=${query}`
    )
    results = await response.json()
    return results
  } catch (err) {
    console.log(err)
  }
}

async function searchOneCard(cardID) {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/${cardID}`)
    card = await response.json()
    return card
  } catch (err) {
    console.log(err)
  }
}

// Page Build and DB

app.get("/getDeckList", (req, res) => {
  getDeckList(res)
})

app.post("/getCard", async (req, res) => {
  const cardID = req.body.cardID
  await searchOneCard(cardID).then((card) => {
    res.json(card)
  })
})

app.post("/getCards", async (req, res) => {
  const deckID = req.body.deckID
  const deckObj = await deck.findOne({ _id: deckID })
  console.log(deckObj)

  res.json(deckObj)
})

app.post("/addCommander", async (req, res) => {
  const deckID = req.body.deckID
  const cardID = req.body.cardID
  const deckObj = await deck.findOne({ _id: deckID })

  await searchOneCard(cardID).then((card) => {
    deckObj.commander = card
  })

  try {
    await deckObj.save()
    res.json(deckObj.commander)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post("/addNewDeck", async (req, res) => {
  const newDeck = new deck({
    name: req.body.deckName.toUpperCase(),
    deckList: [],
  })
  try {
    await newDeck.save()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
  getDeckList(res)
})

app.post("/addCard", async (req, res) => {
  const deckID = req.body.deckID
  const cardID = req.body.cardID
  //console.log(deckID, cardID)

  //Query for card
  try {
    // Query for deck
    const deckObj = await deck.findOne({ _id: deckID })
    //console.log(deckObj)

    // Push new card
    await searchOneCard(cardID).then((card) => {
      deckObj.deckList.push(card)
      res.json(card)
    })

    // Save deck
    try {
      newDeck = await deckObj.save()
      console.log(deckObj.deckList)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  } catch (err) {
    console.log(err)
  }
})

app.post("/addLands", async (req, res) => {
  const deckID = req.body.deckID
  const cardID = req.body.cardID
  const count = req.body.count

  try {
    // Query for deck
    const deckObj = await deck.findOne({ _id: deckID })

    // Push new card
    await searchOneCard(cardID).then((card) => {
      deckObj.deckList.push({
        name: `${count} ${card.name}`,
        id: cardID,
        type_line: "Land",
      })
    })

    // Save deck
    try {
      await deckObj.save()

      for (const card of deckObj.deckList) {
        if (card.id == cardID) {
          res.json(card)
        }
      }
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  } catch (err) {
    console.log(err)
  }
})

app.put("/editDeck/", async (req, res) => {
  const placeholder = req.body.placeholder.toUpperCase()
  const value = req.body.value
  let newDeck
  console.log(placeholder, value)

  const deckObj = await deck.findOne({ name: placeholder })

  deckObj.name = value.toUpperCase()

  try {
    newDeck = await deckObj.save()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
  console.log(newDeck)

  getDeckList(res)
})

app.delete("/deleteDeck/:deckName", async (req, res) => {
  const deckName = req.params.deckName
  console.log(deckName)

  await deck
    .deleteOne({ name: deckName })
    .then(function () {
      console.log("Data deleted")
    })
    .catch(function (error) {
      console.log(error)
    })

  getDeckList(res)
})

app.post("/deleteCard", async (req, res) => {
  const deckID = req.body.deckID
  const cardID = req.body.cardID
  const deckObj = await deck.findOne({ _id: deckID })
  let cardDeck = deckObj.deckList

  for (let i = 0; i < cardDeck.length; i++) {
    if (cardDeck[i].id == cardID) {
      cardDeck.splice(i, 1)
    }
  }

  try {
    await deckObj.save()
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
  res.json(deckObj)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
