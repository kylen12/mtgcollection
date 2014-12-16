"use strict";

module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define("card", {
    image: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.collection);
      }
    }
  });

  return card;
};
