module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    score: DataTypes.INTEGER,
    topScore: DataTypes.INTEGER,
    token: DataTypes.STRING
  });
  return Users;
};
