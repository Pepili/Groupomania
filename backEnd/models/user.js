const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // On relie le modèle User au modèle Publication
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Publication, {
        as: "users",
        foreignKey: "UserId",
      });
    }
  }
  // On créé le modèle User
  User.init(
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      response: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: DataTypes.STRING,
      presentation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
