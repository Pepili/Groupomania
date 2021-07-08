const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const multer = require("../middlewares/multer-config");
const auth = require("../middlewares/auth");

//création de compte
router.post("/signup", userCtrl.signup);

//authentification
router.post("/login", userCtrl.login);

//Profil de l'utilisateur
router.get("/:id", auth, userCtrl.profile);

//modification du compte
router.put("/:id", auth, multer, userCtrl.updateProfile);

// verification reponse
router.post("/response", userCtrl.response);

//modification du mot de passe
router.put("/:id/password", userCtrl.updatePassword);

//suppression du compte
router.delete("/:id", auth, userCtrl.deleteUser);

// Toutes les publications créés par l'utilisateur
router.get("/:id/publications", auth, userCtrl.getAllPublicationsUser);

module.exports = router;
