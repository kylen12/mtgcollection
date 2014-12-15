"use strict";

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return user;
};
