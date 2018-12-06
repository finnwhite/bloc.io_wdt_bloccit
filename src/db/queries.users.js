const User = require( "./models" ).User;
const Post = require( "./models" ).Post;
const Comment = require( "./models" ).Comment;

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

    User.findByPk( id )
    .then( ( user ) => {
      if ( !user ) { callback( 404 ); }
      else {

        Post.scope( { method: [ "lastFiveFor", id ] } ).findAll()
        .then( ( posts ) => {

          Comment.scope( { method: [ "lastFiveFor", id ] } ).findAll()
          .then( ( comments ) => {
            callback( null, { user, posts, comments } )
          } )
          .catch( ( err ) => { callback( err ); } )
        } );
      }
    } );
  }

};
