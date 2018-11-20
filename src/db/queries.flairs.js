const Flair = require( "./models" ).Flair;


module.exports = {

  selectAll( callback ) {
    return (
      Flair.findAll()
      .then( ( flairs ) => { callback( null, flairs ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  select( id, callback ) {
    return (
      Flair.findByPk( id )
      .then( ( flair ) => { callback( null, flair ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  insert( values, callback ) {
    return (
      Flair.create( values )
      .then( ( flair ) => { callback( null, flair ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  update( id, updates, callback ) {
    return (
      Flair.findByPk( id )
      .then( ( flair ) => {
        if ( !flair ) { return callback( "Flair not found." ); }

        flair.update( updates, {
          fields: Object.keys( updates )
        } )
        .then( ( flair ) => { callback( null, flair ); } )
        .catch( ( err ) => { callback( err ); } );
      } )
    )
  }
  ,
  delete( id, callback ) {
    return (
      Flair.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }

};
