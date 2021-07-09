const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// on se connecte à la base de donnée grâce à l'ORM Sequelize
const sequelize = new Sequelize("social", "projet7", "groupomania", {
  host: "localhost",
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("connected!");
  })
  .catch((error) => console.error(error));

/* (async () => {
  await sequelize.sync({ force: true });
})(); */

// On récupère les models et on les stockes dans la base de données de manière auto
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    const instanceModel = model(sequelize, Sequelize.DataTypes);
    db[instanceModel.name] = instanceModel;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
