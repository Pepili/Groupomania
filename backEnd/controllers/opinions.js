const models = require("../models");
const jwt = require("jsonwebtoken");

// Réagir à une publication
exports.opinionPublication = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  // verify va décoder le token
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const UserId = decodedToken.UserId;
  // On récupère l'id de la publication et le type de réaction
  const PublicationId = req.params.id;
  const types = req.body.types;
  // Si aucun des trois n'est trouvé, on retourne une erreur
  if (!UserId || typeof types === undefined || !PublicationId) {
    return res.status(400).json({ message: "not found" });
  }
  // On vérifie si l'user et la publication sont présent
  const existingOpinion = await models.Opinion.findOne({
    where: { UserId, PublicationId },
  });
  // Si il y a deja un avis, on le supprime
  if (existingOpinion) {
    await models.Opinion.destroy({
      where: { id: existingOpinion.id },
    });
  }
  // sinon on le créé
  await models.Opinion.create({
    UserId,
    PublicationId,
    types,
  });
  res.status(201).json({ message: "OK" });
};

// Retirer un opinion
exports.deleteOpinion = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  // verify va décoder le token
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const UserId = decodedToken.UserId;
  const isAdmin = decodedToken.isAdmin;
  // On vérifie si l'user et la publication sont déjà présent
  const opinion = await models.Opinion.findOne({
    where: { PublicationId: req.params.id, UserId },
  });
  // Si il n'y a pas de droit admin ou que l'user n'est pas celui qui a créé l'opinion, on retourne une erreur
  if (!isAdmin && UserId != opinion.UserId) {
    res.status(401).json({
      message: "please ensure you have right to perform this operation",
    });
  }
  // Sinon on supprime l'opinion
  await models.Opinion.destroy({ where: { id: opinion.id } });
  res.status(200).json({ message: "OK" });
};
