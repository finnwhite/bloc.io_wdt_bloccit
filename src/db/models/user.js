'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: { msg: "must be a valid email address" } }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "member"
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany( models.Post, {
      foreignKey: "userId",
      as: "posts"
    } );
    User.hasMany( models.Comment, {
      foreignKey: "userId",
      as: "comments"
    } );
    User.hasMany( models.Vote, {
      foreignKey: "postId",
      as: "votes"
    } );
  };
  User.prototype.isAdmin = function() {
    return ( this.role === "admin" );
  };
  User.prototype.isOwner = function( record ) {
    return ( record.userId == this.id );
  };
  return User;
};
