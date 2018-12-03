const Comment = require( "../../src/db/models" ).Comment;

module.exports = {

  addComment( values, callback ) {
    return (
      Comment.create( values )
      .then( ( comment ) => { callback( null, comment ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  getComment( id, callback ) {
    return (
      Comment.findByPk( id )
      .then( ( comment ) => { callback( null, comment ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  deleteComment( id, callback ) {
    return (
      Comment.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }

};
