"use strict";

module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define("card", {
    name: DataTypes.STRING,
    imgurl: DataTypes.TEXT,
    type: DataTypes.STRING,
    text: DataTypes.TEXT,
    mana: DataTypes.TEXT,
    collection_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return card;
};
