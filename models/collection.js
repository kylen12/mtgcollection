"use strict";

module.exports = function(sequelize, DataTypes) {
  var collection = sequelize.define("collection", {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
<<<<<<< HEAD
        this.hasMany(models.card);
        this.belongsTo(models.user);
=======
        // associations can be defined here
        this.belongsTo(models.user);
        this.hasMany(models.card);
>>>>>>> dbcommands
      }
    }
  });

  return collection;
};
