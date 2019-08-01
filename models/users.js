module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    totalScore: DataTypes.INTEGER,
    topScore: DataTypes.INTEGER,
    avgScore: DataTypes.INTEGER,
    wins: DataTypes.INTEGER,
    losses: DataTypes.INTEGER,
    token: DataTypes.STRING
  });
  return Users;
};
