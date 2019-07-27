module.exports = function (sequelize, DataTypes) {
    var GamePlayer = sequelize.define("GamePlayer", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        displayName: DataTypes.STRING,
        totalWinnings: DataTypes.INTEGER,
        roundWinnings: DataTypes.INTEGER,
        roundsPlayed: DataTypes.INTEGER,
    }, {
        timestamps: false
    });
    return GamePlayer;
};