const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// je configure multer:
// diskstorage enregistre multer sur le disque
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // l'argument null sert à dire qu'il n'y a pas d'erreur:
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //je génère un nouveau nom pour le fichier et je remplace les espaces par des underscores:
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];

    // ----- le timestamp date.now sert à avoir un nom de fichier le plus unique possible ?
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
