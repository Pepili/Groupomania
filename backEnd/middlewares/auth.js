const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // on extrait le token du header authorization et on utilise split pour récuper tout ce qui a apres l'espace
  const token = req.headers.authorization.split(" ")[1];
  // verify va décoder le token
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  // on extrait l'id utilisateur du token
  const UserId = decodedToken.UserId;
  const isAdmin = decodedToken.isAdmin;
  if (!isAdmin && req.body.UserId && req.body.UserId != UserId) {
    throw "User ID invalid !";
    // sinon, tout fonctionne et l'user est authentifié
  } else {
    next();
  }
};
