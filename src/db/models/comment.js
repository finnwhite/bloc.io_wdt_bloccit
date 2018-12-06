'use strict';

module.exports = (sequelize, DataTypes) => {

  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Comment.associate = function(models) {

    Comment.belongsTo( models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE"
    } );
    Comment.belongsTo( models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    } );

    Comment.addScope( "lastFiveFor", ( userId ) => {
      return {
        include: [ { model: models.Post } ],
        where: { userId },
        order: [ [ "createdAt", "DESC" ] ],
        limit: 5
      }
    } );

  };

  return Comment;
};
