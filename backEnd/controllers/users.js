const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const models = require("../models");
const regexEmail =
  /^[a-zA-Z0-9.!#$%&'*+\\\/=?^_`{|}~\-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9\-]{2,63}$/;
const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const regexUser =
  /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,33}$/;
const regexDescription =
  /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -?.]{2,250}$/;

// création de compte
exports.signup = (req, res) => {
  // si les champs sont vides, on engendre une erreur
  if (
    req.body.email == "" ||
    req.body.username == "" ||
    req.body.password == "" ||
    req.body.question == "" ||
    req.body.response == ""
  ) {
    return res.status(400).json({ error: "Please fill in all fields!" });
  }
  // si l'email ou username ne respecte pas les regexp, on engendre une erreur
  if (
    !regexEmail.test(req.body.email.trim()) ||
    !regexUser.test(req.body.username.trim())
  ) {
    return res
      .status(400)
      .json({ error: "'Please fill in the form fields correctly'" });
    // si le password ne respecte pas les regexp, on engendre une erreur
  } else if (!regexPassword.test(req.body.password)) {
    return res.status(400).json({
      error:
        "Your password must contain at least 8 characters, one lower case, one upper case, one number and one special character",
    });
    // On crypte et on hash le mot de passe et la response
  } else {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const hashRes = bcrypt.hashSync(req.body.response, 10);
    req.body.password = hash;
    req.body.response = hashRes;
    // on créé un compte utilisateur
    models.User.create({
      imageUrl: "../images/profilDefault.jpg",
      email: req.body.email,
      username: req.body.username,
      password: hash,
      presentation: "Ce membre n'a pas de présentation",
      question: req.body.question,
      response: hashRes,
      isAdmin: false,
    })
      .then((user) => {
        res.status(201).json({
          UserId: user.id,
          admin: user.isAdmin,
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// Connexion
exports.login = (req, res) => {
  // Si les champs email ou password sont vide, on engendre une erreur
  if (req.body.email == null || req.body.password == null) {
    return res.status(400).json({ error: "Please fill in all fields!" });
  }
  // on trouve l'user grâce à son email vu qu'il est unique
  models.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found..." });
      }
      // on compare le mdp form et le mdp présent dans la db
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Wrong password..." });
          }
          res.status(200).json({
            UserId: user.id,
            isAdmin: user.isAdmin,
            username: user.username,
            // encodage d'un nouveau token signé valable 24h contenant l'UserId en tant que payload
            token: jwt.sign(
              { UserId: user.id, isAdmin: user.isAdmin },
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// On récupère les infos de l'user
exports.profile = (req, res) => {
  // On récupère les infos de l'user demandé
  models.User.findOne({
    attributes: ["id", "username", "imageUrl", "presentation"],
    where: { id: req.params.id },
    include: [models.Publication, models.Opinion],
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
        message: "user not found..",
      });
    });
};

// On modifie son compte
exports.updateProfile = async (req, res) => {
  // si une image est ajouté, on la traite
  var userProfile = {};
  if (req.file) {
    userProfile = {
      ...JSON.parse(req.body.user),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    userProfile = { ...req.body };
  }
  // ----------------------------------------------------------------------------------
  //Si la value email, username ou presentation ne respecte pas le regexp, elle n'est pas valide
  if (
    (userProfile.email && !regexEmail.test(userProfile.email.trim())) ||
    (userProfile.username && !regexUser.test(userProfile.username.trim())) ||
    (userProfile.presentation &&
      !regexDescription.test(userProfile.presentation.trim()))
  ) {
    return res
      .status(400)
      .json({ error: "Please fill in the form fields correctly'" });
  }
  // ----------------------------------------------------------------------------------
  // Si il y a l'ajout d'une image, on supprime l'ancienne sauf si c'est par défaut
  if (req.file) {
    const profile = await models.User.findOne({ id: req.params.id });
    if (profile.imageUrl !== "../images/profilDefault.jpg") {
      const filename = profile.imageUrl.split("/images/")[1];
      const fsError = await fs.promises.unlink(`images/${filename}`);
      if (fsError) return res.status(400).json({ error: fsError });
    }
  }
  // ----------------------------------------------------------------------------------
  // Si tout est valide, on effectue les modifications
  models.User.update(
    { ...userProfile, id: req.params.id },
    { where: { id: req.params.id } }
  )
    .then(() => res.status(200).json({ message: "Profil modifié!" }))
    .catch((error) => res.status(403).json({ error }));
};

// On traite la reponse lors du changement de mot de passe
exports.response = (req, res) => {
  if (req.body.response == null || req.body.username == null) {
    return res.status(400).json({ error: "Please fill in all fields!" });
  }
  // On cherche l'utilisateur grâce à l'username
  models.User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "le nom d'utilisateur n'existe pas" });
      }
      // On compare la response form avec la response db
      bcrypt
        .compare(req.body.response, user.response)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "La réponse est erronée" });
          }
          res.status(200).json({
            message: "authentification réussi",
            UserId: user.id,
            username: user.username,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// on modifie le mot de passe
exports.updatePassword = async (req, res) => {
  // On récupère le password écrit dans le form
  const userPassword = req.body.password;
  if (userPassword == null || !regexPassword.test(userPassword.trim())) {
    return res.status(400).json({ error: "Please fill in all fields!" });
  }
  // On modifie l'ancien password avec le nouveau
  const userPasswordHashed = await bcrypt.hash(userPassword, 10);
  await models.User.update(
    { password: userPasswordHashed },
    { where: { id: req.params.id } }
  )
    .then(() => res.status(200).json({ message: "Mot de passe modifié" }))
    .catch((error) => res.status(500).json({ error }));
};

// On supprime l'utilisateur
exports.deleteUser = async (req, res) => {
  // On cherche toute les publications créées par l'user
  const publications = await models.Publication.findAll({
    where: { UserId: req.params.id },
  });
  for (const publication of publications) {
    if (publication.file) {
      const publicationFilename = publication.file.split("/images/")[1];
      await fs.promises.unlink(`images/${publicationFilename}`);
    }
    // On supprime les Opinions des publications de l'user
    await models.Opinion.destroy({ where: { PublicationId: publication.id } });
  }
  // On supprime les publications
  await models.Publication.destroy({ where: { UserId: req.params.id } });
  // On supprime les opinions de l'user
  await models.Opinion.destroy({ where: { UserId: req.params.id } });
  const user = await models.User.findOne({ where: { id: req.params.id } });
  const filename = user.imageUrl.split("/images/")[1];
  if (filename !== "profilDefault.jpg") {
    await fs.promises.unlink(`images/${filename}`);
  }
  // On supprime l'user
  await user.destroy({ where: { id: req.params.id } });
  res.status(200).json({ message: "Compte supprimé" });
};

// On récupère toute les publications de l'utilisateur indiqué
exports.getAllPublicationsUser = (req, res) => {
  models.Publication.findAll({
    order: [["updatedAt", "DESC"]],
    include: [models.User, models.Opinion],
    where: { UserId: req.params.id },
  })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
