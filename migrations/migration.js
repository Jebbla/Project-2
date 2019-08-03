module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all([
        queryInterface.addColumn("Users", "token", {
          type: Sequelize.STRING
        }, { transaction: t })
      ]);
    });
  },

  down: function(queryInterface) {
    return queryInterface.sequelize.transaction(function(t) {
      return Promise.all([
        queryInterface.removeColumn("Users", "token", { transaction: t }),
      ]);
    });
  }
};