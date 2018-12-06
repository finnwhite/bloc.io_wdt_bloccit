const userQueries = require( "../db/queries.users.js" );
const passport = require( "passport" );

module.exports = {

  signUp( req, res, next ) {
    res.render( "users/sign_up" );
  }
  ,
  create( req, res, next ) {
    const values = { email: req.body.email, password: req.body.password };
    userQueries.createUser( values, ( err, user ) => {
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
        req.flash( "error", [ {
          param: info.message,
          msg: "Sign in failed. Please try again."
        } ] );
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
  ,
  show( req, res, next ) {
    userQueries.getUser( req.params.id, ( err, profile ) => {
      if ( err || !profile.user ) {
        req.flash( "notice", "No user found with that ID." );
        res.redirect( "/" );
      }
      else { res.render( "users/show", { ...profile } ); }
    } );
  }

};
