const express = require("express");
const router = express.Router();
const publicationCtrl = require("../controllers/publications");
const opinionCtrl = require("../controllers/opinions");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

//Création d'une publication
router.post("/", auth, multer, publicationCtrl.createPublication);

//Suppression d'une publication
router.delete("/:id", auth, publicationCtrl.deletePublication);

// récupération de toutes les publications
router.get("/", auth, publicationCtrl.getAllPublications);

// opinion
router.post("/:id/opinion", auth, opinionCtrl.opinionPublication);
router.delete("/:id/opinion/", auth, opinionCtrl.deleteOpinion);

module.exports = router;
