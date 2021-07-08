const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Opinion extends Model {
    static associate(models) {
      models.Publication.hasMany(models.Opinion, {
        foreignKey: "PublicationId",
      });
      models.Opinion.belongsTo(models.Publication, {
        foreignKey: "PublicationId",
      });

      models.User.hasMany(models.Opinion, { foreignKey: "UserId" });
      models.Opinion.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Opinion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Opinion",
      tableName: "opinions",
    }
  );
  return Opinion;
};
