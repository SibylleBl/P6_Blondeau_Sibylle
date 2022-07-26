const jsonWebToken = require("jsonwebtoken");

//middleware qui permet d'extraire les infos du token afin de les transmettre aux autres middlewares:
module.exports = (req, res, next) => {
  //je récupère le TOKEN:
  try {
    // le .split divise la chaine de caractère:
    const token = req.headers.authorization.split(" ")[1]; // je récupère le token qui se trouve en deuxième.

    // je décode le token:
    const decodedToken = jsonWebToken.verify(token, "RAMDOM_TOKEN_SECRET");

    // je récupère le userId:
    const userId = decodedToken.userId;

    //je rajoute la valeur userId à l'objet request:
    req.auth = {
      userId: userId,
    };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      console.log("authentifier");
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
