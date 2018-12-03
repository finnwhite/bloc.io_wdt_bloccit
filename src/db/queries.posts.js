const User = require( "../../src/db/models" ).User;
const Post = require( "../../src/db/models" ).Post;
const Comment = require( "../../src/db/models" ).Comment;

module.exports = {

  addPost( values, callback ) {
    return (
      Post.create( values )
      .then( ( post ) => { callback( null, post ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  getPost( id, callback ) {
    return (
      Post.findByPk( id, {
        include: [ { model: Comment, as: "comments",
          include: [ { model: User } ]
        } ]
      } )
      .then( ( post ) => { callback( null, post ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  deletePost( id, callback ) {
    return (
      Post.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  updatePost( id, updates, callback ) {
    return (
      Post.findByPk( id )
      .then( ( post ) => {
        if ( !post ) { return callback( 404 ); } // 404 Not Found

        post.update( updates, { fields: Object.keys( updates ) } )
        .then( ( post ) => { callback( null, post ); } )
        .catch( ( err ) => { callback( err ); } );
      } )
    )
  }

};
