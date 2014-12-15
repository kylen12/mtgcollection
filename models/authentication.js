"use strict";

module.exports = function(sequelize, DataTypes) {
  var authentication = sequelize.define("authentication", {
    user_id: DataTypes.INTEGER,
    password_digest: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return authentication;
};
