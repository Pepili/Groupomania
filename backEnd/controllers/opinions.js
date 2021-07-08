const models = require("../models");
const jwt = require("jsonwebtoken");

// aimer une publication
exports.opinionPublication = async (req, res) => {
  // je récupere l'UserId, la publication_id et le type de like
  const token = req.headers.authorization.split(" ")[1];
  // verify va décoder le token
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  // on extrait l'id utilisateur du token
  const UserId = decodedToken.UserId;
  const PublicationId = req.params.id;
  const types = req.body.types;
  // Si aucun des trois n'est trouvé, on retourne une erreur
  if (!UserId || typeof types === undefined || !PublicationId) {
    return res.status(400).json({ message: "not found" });
  }
  const existingOpinion = await models.Opinion.findOne({
    where: { UserId, PublicationId },
  });
  if (existingOpinion) {
    await models.Opinion.destroy({
      where: { id: existingOpinion.id },
    });
  }
  await models.Opinion.create({
    UserId,
    PublicationId,
    types,
  });
  res.status(201).json({ message: "OK" });
};

exports.deleteOpinion = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  // verify va décoder le token
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  // on extrait l'id utilisateur du token
  const UserId = decodedToken.UserId;
  const isAdmin = decodedToken.isAdmin;
  const opinion = await models.Opinion.findOne({
    where: { PublicationId: req.params.id, UserId },
  });
  if (!isAdmin && UserId != opinion.UserId) {
    res.status(401).json({
      message: "please ensure you have right to perform this operation",
    });
  }
  await models.Opinion.destroy({ where: { id: opinion.id } });
  res.status(200).json({ message: "OK" });
};
