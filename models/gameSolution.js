module.exports = function(sequelize, DataTypes) {
  var GameSolution = sequelize.define(
    "GameSolution",
    {
      solution: DataTypes.STRING,
      category: DataTypes.TEXT
    },
    {
      timestamps: false
    }
  );
  return GameSolution;
};
