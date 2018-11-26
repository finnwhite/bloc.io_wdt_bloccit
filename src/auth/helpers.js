const bcrypt = require( "bcryptjs" );

module.exports = {

  ensureAuthenticated( req, res, next ) {
    if ( !req.user ) {
      req.flash( "notice", "You must be signed in to do that." );
      return res.redirect( "/users/sign_in" );
    }
    else { next(); }
  }
  ,
  matchPassword( password, hash ) {
    return bcrypt.compareSync( password, hash );
  }

};
