const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static associate(models) {
      models.User.hasMany(models.Publication, { foreignKey: "UserId" });
      models.Publication.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }

  Publication.init(
    {
      file: DataTypes.STRING,
      text: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Publication",
      tableName: "publications",
    }
  );
  return Publication;
};
