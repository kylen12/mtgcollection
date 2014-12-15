"use strict";

module.exports = function(sequelize, DataTypes) {
  var collection = sequelize.define("collection", {
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return collection;
};
