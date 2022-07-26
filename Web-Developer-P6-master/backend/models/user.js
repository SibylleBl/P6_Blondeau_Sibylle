const mongoose = require("mongoose");

// l'installation de l'unique-validator empêche-
// -un utilisateur de s'incrire deux fois avec le même email:
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// j'applique l'unique-validator au schema avant d'en faire un modèle:
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
