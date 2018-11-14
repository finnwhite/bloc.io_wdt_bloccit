module.exports = {
  index( req, res, next ) {
    res.send( "advertisements/index" );
  }
  ,
  add( req, res, next ) {
    res.send( "advertisements/add" );
  }
  ,
  create( req, res, next ) {
    res.send( "advertisements/create" );
  }
  ,
  view( req, res, next ) {
    res.send( "advertisements/view" );
  }
  ,
  edit( req, res, next ) {
    res.send( "advertisements/edit" );
  }
  ,
  update( req, res, next ) {
    res.send( "advertisements/update" );
  }
  ,
  delete( req, res, next ) {
    res.send( "advertisements/delete" );
  }
};
