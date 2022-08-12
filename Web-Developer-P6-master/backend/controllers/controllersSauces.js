const sauces = require("../models/sauces");
const fs = require("fs");

// j'exporte la fonction qui gère la route POST:

exports.createSauces = (req, res, next) => {
  console.log(req.body);
  const sauceObject = JSON.parse(req.body.sauce);
  //on enlève le champs id généré automatiquement par mongo car ce n'est pas le bon:
  delete sauceObject._id;
  // je supprime aussi le champs userId de la personne qui a créé l'objet car je ne veux pas faire confiance au client:
  delete sauceObject._userId;

  //j'utilise l'userId généré pas le token d'authentification:
  const sauce = new sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
  });

  // j'enregistre ce nouvel objet dans la base de données:
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.modifySauces = (req, res, next) => {
  //Je vérifie d'abord si l'utilisateur a transmit un fichier ou pas:
  // si oui :
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/image/${
          req.file.filename
        }`,
        // si non, je récupère directement l'objet:
      }
    : { ...req.body };

  // même mesure de sécurité qu'au dessus:
  delete sauceObject._userId;

  //Je récupère l'objet dans la base de données (afin d'être sûr que c'est l'utilisateur qui a créé l'objet qui cherche à le modifier):
  sauces
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      //si l'id est différent de celui du token, quelqu'un essaye de modifier un objet qui ne lui appartient pas:
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        sauces
          .updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
  sauces
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      //je vérifie encore si c'est bien le propriétaire de l'objet qui demande la suppression:
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        //je supprime l'objet de la base de données ET l'image du fichier images:
        const filename = sauce.imageUrl.split("/images")[1]; //--- emplacement de l'image
        fs.unlink(`images/${filename}`, () =>
          sauces
            .deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(401).json({ error: error }))
        );
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  sauces
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error: error }));
};

exports.getAllSauces = (req, res, next) => {
  sauces
    .find()
    .then((allSauces) => res.status(200).json(allSauces))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.likeSauce = (req, res, next) => {
  sauces
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case -1:
          //
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes++;
          }
          break;

        case 1:
          if (!sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes++;
          }
          break;

        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.splice(
              sauce.usersLiked.indexOf(req.body.userId),
              1
            );
            sauce.likes--;
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            sauce.usersDisliked.splice(
              sauce.usersDisliked.indexOf(req.body.userId),
              1
            );
            sauce.dislikes--;
          }
          break;

        default:
          break;
      }
      sauce
        .save()
        .then(() => {
          res.status(200).json({ message: "Tableau mis à jour" });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
