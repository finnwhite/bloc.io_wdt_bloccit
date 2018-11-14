const queries = require( "../db/queries.advertisements.js" );

module.exports = {
  index( req, res, next ) {
    queries.selectAll( ( err, adverts ) => {
      if ( err ) { res.redirect( 500, "static/index" ); }
      else { res.render( "advertisements/index", { adverts } ); }
    } );
  }
  ,
  add( req, res, next ) {
    res.render( "advertisements/add" );
  }
  ,
  create( req, res, next ) {
    const advert = {
      title: req.body.title,
      description: req.body.description
    };
    queries.insert( advert, ( err, advert ) => {
      if ( err ) { res.redirect( 500, "advertisements/add" ); }
      else { res.redirect( 303, `/advertisements/${ advert.id }` ); }
    } );
  }
  ,
  view( req, res, next ) {
    queries.select( req.params.id, ( err, advert ) => {
      if ( err || advert == null ) { res.redirect( 404, "/" ); }
      else { res.render( "advertisements/view", { advert } ); }
    } );
  }
  ,
  edit( req, res, next ) {
    queries.select( req.params.id, ( err, advert ) => {
      if ( err || advert == null ) { res.redirect( 404, "/" ); }
      else { res.render( "advertisements/edit", { advert } ); }
    } );
  }
  ,
  update( req, res, next ) {
    queries.update( req.params.id, req.body, ( err, advert ) => {
      if ( err || advert == null ) {
        res.redirect( 404, `/advertisements/${ req.params.id }/edit` );
      }
      else { res.redirect( 303, `/advertisements/${ advert.id }` ); }
    } );
  }
  ,
  delete( req, res, next ) {
    queries.delete( req.params.id, ( err, advert ) => {
      if ( err ) { res.redirect( 500, `/advertisements/${ advert.id }` ); }
      else { res.redirect( 303, "/advertisements" ); }
    } );
  }
};
