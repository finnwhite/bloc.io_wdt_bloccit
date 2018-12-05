const Favorite = require( "../../src/db/models" ).Favorite;

module.exports = {

  addFavorite( values, callback ) {
    return (
      Favorite.create( values )
      .then( ( favorite ) => { callback( null, favorite ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  getFavorite( id, callback ) {
    return (
      Favorite.findByPk( id )
      .then( ( favorite ) => { callback( null, favorite ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  deleteFavorite( id, callback ) {
    return (
      Favorite.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }

};
