const mongoose = require("mongoose")

const deckSchema = new mongoose.Schema({
  name: String,
  commander: Object,
  deckList: [],
})

module.exports = mongoose.model("deck", deckSchema)
