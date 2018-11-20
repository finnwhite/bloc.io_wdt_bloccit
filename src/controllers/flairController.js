const queries = require( "../db/queries.flairs.js" );
const palette = require( "../assets/color-palette.js" );


module.exports = {

  index( req, res, next ) {
    queries.selectAll( ( err, flairs ) => {
      if ( err ) { res.redirect( 500, "static/index" ); }
      else { res.render( "flairs/index", { flairs } ); }
    } );
  }
  ,
  add( req, res, next ) {
    res.render( "flairs/add", { palette } );
  }
  ,
  create( req, res, next ) {
    const values = {
      name: req.body.name,
      color: req.body.color
    };
    queries.insert( values, ( err, flair ) => {
      if ( err ) { res.redirect( 500, "/flairs/add" ); }
      else { res.redirect( 303, `/flairs/${ flair.id }` ); }
    } );
  }
  ,
  view( req, res, next ) {
    queries.select( req.params.id, ( err, flair ) => {
      if ( err || flair == null ) { res.redirect( 404, "/" ); }
      else { res.render( "flairs/view", { flair } ); }
    } );
  }
  ,
  edit( req, res, next ) {
    queries.select( req.params.id, ( err, flair ) => {
      if ( err || flair == null ) { res.redirect( 404, "/" ); }
      else { res.render( "flairs/edit", { flair, palette } ); }
    } );
  }
  ,
  update( req, res, next ) {
    queries.update( req.params.id, req.body, ( err, flair ) => {
      if ( err || flair == null ) {
        res.redirect( 404, `/flairs/${ req.params.id }/edit` );
      }
      else { res.redirect( 303, `/flairs/${ flair.id }` ); }
    } );
  }
  ,
  delete( req, res, next ) {
    queries.delete( req.params.id, ( err, flair ) => {
      if ( err ) { res.redirect( 500, `/flairs/${ flair.id }` ); }
      else { res.redirect( 303, "/flairs" ); }
    } );
  }

};
