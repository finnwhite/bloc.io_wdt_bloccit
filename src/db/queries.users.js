const User = require( "./models" ).User;
const Post = require( "./models" ).Post;
const Comment = require( "./models" ).Comment;
const Favorite = require( "./models" ).Favorite;

const bcrypt = require( "bcryptjs" );

module.exports = {

  createUser( values, callback ) {

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync( values.password, salt );

    return (
      User.create( { email: values.email, password: hash } )
      .then( ( user ) => { callback( null, user ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  getUser( id, callback ) {

    User.scope( "favoritePosts" ).findByPk( id )
    .then( ( user ) => {
      if ( !user ) { callback( 404 ); }
      else {
        console.log( user.favorites ); // works on test, not in browser

        Post.scope( { method: [ "lastFiveFor", id ] } ).findAll()
        .then( ( posts ) => {

          Comment.scope( { method: [ "lastFiveFor", id ] } ).findAll()
          .then( ( comments ) => {

            Favorite.scope( { method: [ "favoritedBy", id ] } ).findAll()
            .then( ( favorites ) => {
              console.log( favorites ); // works on test, works in browser

              callback( null, { user, posts, comments, favorites } )
            } )
            .catch( ( err ) => { callback( err ); } )
          } );
        } );
      }
    } );
  }

};
