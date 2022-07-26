const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config.js");

const router = express.Router();

const saucesControllers = require("../controllers/controllersSauces.js");

// (route POST) Je vais chercher le middleware pour créer une sauce (objet):
router.post("/", auth, multer, saucesControllers.createSauces);
// (route PUT) Je vais chercher le middleware pour modifier une sauce (objet):
router.put("/:id", auth, multer, saucesControllers.modifySauces);
// (route DELETE) Je vais chercher le middleware pour supprimer une sauce(objet):
router.delete("/:id", auth, saucesControllers.deleteSauces);
// (route GET) Je vais chercher le middleware qui me permet d'aller chercher une seule sauce spécifique:
router.get("/:id", auth, saucesControllers.getOneSauce);
// (route GET) Je vais chercher le middleware qui va chercher la liste complète de mes sauces:
router.get("/", auth, saucesControllers.getAllSauces);
// (route POST) Je vais chercher le middleware qui classe les utilisateurs au bon endroit s'ils ont liké:
router.post("/:id/like", auth, saucesControllers.likeSauce);

//j'exporte mon ensemble de routes (router):
module.exports = router;
