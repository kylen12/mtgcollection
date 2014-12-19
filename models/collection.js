"use strict";

module.exports = function(sequelize, DataTypes) {
  var collection = sequelize.define("collection", {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.hasMany(models.card);
        this.belongsTo(models.user);
      }
    }
  });

  return collection;
};
