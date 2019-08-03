module.exports = function (sequelize, DataTypes) {
  var GameBoard = sequelize.define("GameBoard", {
    spaceType: DataTypes.STRING,
    spaceValue: DataTypes.INTEGER,
    displayValue: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    timestamps: false
  });
  return GameBoard;
};