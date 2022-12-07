require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const deck = require("./models/deck")
const app = express()
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

// Page Build and DB

app.get("/getDeckList", (req, res) => {
  getDeckList(res)
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.put("/editDeck/", async (req, res) => {
  const placeholder = req.body.placeholder.toUpperCase()
  const value = req.body.value
  console.log(placeholder, value)

  const deckObj = await deck.findOne({ name: placeholder })

  deckObj.name = value.toUpperCase()

  let newDeck = await deckObj.save()
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
