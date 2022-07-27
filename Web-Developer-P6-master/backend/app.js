// création de l'application express en appelant la méthode express():
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
console.log("🚀 ~ file: app.js ~ line 8 ~ dotenv", dotenv);

//j'importe mes routes:
const saucesRoutes = require("./routes/routeSauces.js");
const userRoutes = require("./routes/routeUser.js");

mongoose
  .connect(dotenv.mongoDBid, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à mongoDB échouée !"));

// Je vais chercher toutes les requêtes qui ont un format json:
app.use(express.json());
app.use(cors());

// je définie des headers ici pour pouvoir: - accéder à mon api depuis n'importe quelle origine ('*')
// - ajouter les headers mentionnés aux requêtes envoyées vers mon api
// - envoyer des requêtes (GET, POST? ect...)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// j'enregistre mes routes:
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
// ----Ce gestionnaire de route indique à Express qu'il faut gérer la ressource "images" de manière statique
app.use("/images", express.static(path.join(__dirname, "images")));

// j'exporte mon application:
module.exports = app;
