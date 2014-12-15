"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("cards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      imgurl: {
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.STRING
      },
      text: {
        type: DataTypes.TEXT
      },
      mana: {
        type: DataTypes.TEXT
      },
      collection_id: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("cards").done(done);
  }
};