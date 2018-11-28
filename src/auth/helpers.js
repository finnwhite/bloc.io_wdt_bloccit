const bcrypt = require( "bcryptjs" );

module.exports = {

  ensureAuthenticated( req, res, next ) {
    if ( !req.user ) {
      req.flash( "notice", "You must be signed in to do that." );
      return res.redirect( 401, "/users/sign_in" ); // 401 Unauthorized
    }
    else { next(); }
  }
  ,
  matchPassword( password, hash ) {
    return bcrypt.compareSync( password, hash );
  }

};
