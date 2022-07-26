//j'ai besoin d'express pour créer un router:
const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/controllersUser.js");

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);

module.exports = router;
