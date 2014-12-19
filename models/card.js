"use strict";

module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define("card", {
    image: DataTypes.STRING,
    collectionId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
<<<<<<< HEAD
=======
        // associations can be defined here
>>>>>>> dbcommands
        this.belongsTo(models.collection);
      }
    }
  });

  return card;
};
