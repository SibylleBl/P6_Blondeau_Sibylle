const mongoose = require("mongoose");

const saucesSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  imageUrl: { type: String, required: true },
  mainPepper: { type: String, required: true },
  usersLiked: [String],
  usersDisliked: [String],
  userId: { type: String, required: true },
});

module.exports = mongoose.model("sauces", saucesSchema);
