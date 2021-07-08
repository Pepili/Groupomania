const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/users");
const publicationRoutes = require("./routes/publications");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(cors());
app.use(express.json());
// indique à express de gérer la ressource images de manière statique à chaque requête vers /images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
module.exports = app;
