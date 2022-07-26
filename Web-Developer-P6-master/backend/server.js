//  require permet d'importer un module node sans avoir besoin de spécifier un chemin exact.
const http = require("http");
// j'importe l'application express:
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  //    la fonction isNaN permet de déterminer si une fonction est NaN ou pas.
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// cette fonction renvoie un port valide (sous forme d'un numéro ou d'un string)
const port = normalizePort(process.env.PORT || "3000");
// je dis à mon application sur quel port elle doit tourner (port(environnement ou 3000)):
app.set("port", port);

//  cette fonction cherche d'éventuelles erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    // throw lève une exception définie. l'exécution de la fonction est alors stoppée (les instructions qui suivent ne seront pas exécutées)
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  // switch (et case) évalue une expression et exécute ou pas les instructions correspondantes:
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      //   break termine la boucle en cours
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// je passe mon application express en paramètre:
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// je configure le serveur pour qu'il écoute la const port définie plus haut
server.listen(port);
