'use strict';

module.exports = (sequelize, DataTypes) => {

  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Post.associate = function(models) {

    Post.belongsTo( models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    } );
    Post.belongsTo( models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    } );

    Post.hasMany( models.Comment, {
      foreignKey: "postId",
      as: "comments"
    } );
    Post.hasMany( models.Vote, {
      foreignKey: "postId",
      as: "votes"
    } );
    Post.hasMany( models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    } );

    Post.afterCreate( ( post, callback ) => {
      return ( models.Favorite
        .create( { userId: post.userId, postId: post.id } )
      )
    } );
    Post.afterCreate( ( post, callback ) => {
      return ( models.Vote
        .create( { value: UPVOTE, userId: post.userId, postId: post.id } )
      )
    } );

    Post.addScope( "lastFiveFor", ( userId ) => {
      return {
        where: { userId },
        order: [ [ "createdAt", "DESC" ] ],
        limit: 5
      }
    } );

  };

  const UPVOTE = 1;
  const DOWNVOTE = -1;

  Post.prototype.getPoints = function() {
    if ( !this.votes || !( this.votes.length > 0 ) ) { return 0; }
    return ( this.votes
      .map( ( vote ) => { return vote.value; } )
      .reduce( ( acc, value ) => { return ( acc + value ) } )
    )
  };

  Post.prototype.hasUpvoteFor = function( userId ) {
    if ( !this.votes || !( this.votes.length > 0 ) ) { return false; }
    return Boolean(
      this.votes.find( ( vote ) => {
        return ( ( vote.userId == userId ) && ( vote.value == UPVOTE ) )
      } )
    );
  };
  Post.prototype.hasDownvoteFor = function( userId ) {
    if ( !this.votes || !( this.votes.length > 0 ) ) { return false; }
    return Boolean(
      this.votes.find( ( vote ) => {
        return ( ( vote.userId == userId ) && ( vote.value == DOWNVOTE ) )
      } )
    );
  };

  Post.prototype.getFavoriteFor = function( userId ) {
    if ( !this.favorites ) { return; }
    return (
      this.favorites.find( ( favorite ) => {
        return ( favorite.userId == userId )
      } )
    )
  };

  return Post;
};
