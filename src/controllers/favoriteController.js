const favoriteQueries = require( "../db/queries.favorites.js" );
const FavoritePolicy = require( "../policies/favorite.js" );

module.exports = {

  create( req, res, next ) {
    if ( req.user ) {
      const values = { postId: req.params.postId, userId: req.user.id };
      favoriteQueries.addFavorite( values, ( err, fav ) => {
        if ( err ) { req.flash( "error", err ); }
        //else { req.flash( "notice", "Added to your favorites!" ); }
        res.redirect( req.headers.referer );
      } );
    }
    else {
      req.flash( "notice", "You must be signed in to do that." );
      res.redirect( req.headers.referer );
    }
  }
  ,
  destroy( req, res, next ) {
    if ( req.user ) {
      favoriteQueries.getFavorite( req.params.id, ( err, fav ) => {
        if ( err || !fav ) { res.redirect( req.headers.referer ); }
        else {
          if ( new FavoritePolicy( req.user, fav ).destroy() ) {
            favoriteQueries.deleteFavorite( fav.id, ( err, count ) => {
              if ( err ) { req.flash( "error", err ); }
              //else { req.flash( "notice", "Removed from your favorites." );
              res.redirect( req.headers.referer );
            } );
          }
          else {
            req.flash( "notice", "You are not authorized to do that." );
            res.redirect( req.headers.referer );
          }
        }
      } );
    }
    else {
      req.flash( "notice", "You must be signed in to do that." );
      res.redirect( req.headers.referer );
    }
  }

};
