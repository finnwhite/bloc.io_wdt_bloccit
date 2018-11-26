const userQueries = require( "../db/queries.users.js" );
const passport = require( "passport" );

module.exports = {

  signUp( req, res, next ) {
    res.render( "users/sign_up" );
  }
  ,
  create( req, res, next ) {
    const newUser = { email: req.body.email, password: req.body.password };
    userQueries.createUser( newUser, ( err, user ) => {
      if ( err ) {
        req.flash( "error", err );
        res.redirect( "/users/sign_up" );
      }
      else {
        passport.authenticate( "local" )( req, res, () => {
          req.flash( "notice", "You have successfully signed in!" );
          res.redirect( "/" );
        } );
      }
    } );
  }
  ,
  signInForm( req, res, next ) {
    res.render( "users/sign_in" );
  }
  ,
  signIn( req, res, next ) {
    passport.authenticate( "local", ( err, user, info ) => {
      if ( err ) { return next( err ); }
      if ( !user ) {
        req.flash( "notice", "Sign in failed. Please try again." );
        return res.redirect( "/users/sign_in" );
      }
      req.logIn( user, ( err ) => {
        if ( err ) { return next( err ); }
        req.flash( "notice", "You have successfully signed in!" );
        return res.redirect( "/" );
      } );
    } )( req, res, next );
  }
  ,
  signOut( req, res, next ) {
    req.logout();
    req.flash( "notice", "You have successfully signed out." );
    res.redirect( "/" );
  }

};
