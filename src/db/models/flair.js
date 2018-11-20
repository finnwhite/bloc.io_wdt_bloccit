'use strict';
module.exports = (sequelize, DataTypes) => {
  const Flair = sequelize.define('Flair', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    color: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
  };
  return Flair;
};
