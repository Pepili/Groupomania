const fs = require("fs");
const models = require("../models");
const regexDescription =
  /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' ?!-:()=@"€$+/#.]{2,800}$/;
const jwt = require("jsonwebtoken");

// Création d'une publication
exports.createPublication = (req, res) => {
  // Si il n'y a ni image ni texte, il est impossible de créer une publication
  if (
    typeof req.body.file === "undefined" &&
    req.body.text &&
    req.body.text.length === 0
  ) {
    return res.status(400).json({ error: "Choose a picture or write text" });
  }
  var createPost = {};
  // SI il y a une image, on la traite
  if (req.file) {
    createPost = {
      ...JSON.parse(req.body.text),
      file: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    };
  } else {
    createPost = { ...req.body };
  }
  // Si il y a un texte, on vérifie son contenu avant de le créer
  if (createPost.text && !regexDescription.test(createPost.text.trim())) {
    return res
      .status(400)
      .json({ error: "Please fill in the form fields correctly" });
  } else {
    models.Publication.create({
      ...createPost,
    })
      .then((post) => {
        res.status(201).json({
          ...post.dataValues,
        });
      })
      .catch((err) => res.status(400).json({ err }));
  }
};

//Supprimer une publication
exports.deletePublication = (req, res) => {
  // on cherche la publication concerné
  models.Publication.findOne({ where: { id: req.params.id } })
    .then((publication) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const UserId = decodedToken.UserId;
      const isAdmin = decodedToken.isAdmin;
      // Si il n'y a ni droit admin, ni le bon user, on retourne une erreur
      if (!isAdmin && publication.UserId !== UserId) {
        return res.status(401).json({
          error: "please, ensure you have right to perform this operation",
        });
      }
      // On vérifie si il y a une image
      if (publication.file) {
        const filename = publication.file.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          publication
            .destroy({ where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: "Publication" }))
            .catch((err) => res.status(400).json({ err }));
        });
      }
      publication
        .destroy({ where: { id: req.params.id } })
        .then(() => res.status(200).json({ message: "Publication" }))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};

// récupération de toutes les publications
exports.getAllPublications = (req, res) => {
  // on récupére tout les publications avec leur nom d'utilisateur
  models.Publication.findAll({
    include: [models.User, models.Opinion],
    // on les classes par ordre décroissant des ajouts
    order: [["updatedAt", "DESC"]],
  })
    .then((publication) => res.status(200).json(publication))
    .catch((error) => res.status(400).json({ error }));
};
