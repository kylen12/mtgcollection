"use strict";

module.exports = function(sequelize, DataTypes) {
  var collection = sequelize.define("collection", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.card);
        this.belongsTo(models.user);
      }
    }
  });

  return collection;
};
