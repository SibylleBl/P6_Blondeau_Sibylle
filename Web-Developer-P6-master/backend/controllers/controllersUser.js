const bcrypt = require("bcrypt");
const user = require("../models/user.js");
const jsonWebToken = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = (req, res, next) => {
  //Fonction qui permet de crypter un mot de passe le package bcrypt:
  bcrypt
    .hash(req.body.password, 10)
    // je définis les infos de mon nouveau user avec le mdp crypté:
    .then((hash) => {
      const newUser = new user({
        email: req.body.email,
        password: hash,
      });
      // j'enregistre mon nouvel utilisateur dans la base de données:
      newUser
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error: error }));
    })
    // code 500: erreur serveur
    .catch((error) => res.status(500).json({ error: error }));
};

exports.login = (req, res, next) => {
  user
    .findOne({ email: req.body.email })
    //je récupère l'enregistrement dans la base de données, puis je dois:

    .then((user) => {
      // ---- vérifier si l'utilisateur a été trouvé:
      if (user === null) {
        //je reste flou dans le message d'erreur pour éviter une fuite de données:
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte" });
      } else {
        //--- si l'utilisateur est bien enregistré dans la base de données, je compare le mdp de la base de donnée avec le mdp transmis:
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrecte" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jsonWebToken.sign(
                  { userId: user._id },
                  process.env.SECRET_TOKEN,
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    //erreur d'éxécution de requête dans la base de données:
    .catch((error) => {
      res.status(500).json({ error });
    });
};
