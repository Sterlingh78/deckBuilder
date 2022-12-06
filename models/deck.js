const mongoose = require("mongoose")

const deckSchema = new mongoose.Schema({
  name: String,
  deckList: [],
})

module.exports = mongoose.model("deck", deckSchema)
