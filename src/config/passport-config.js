const passport = require( "passport" );
const LocalStrategy = require( "passport-local" ).Strategy;
const User = require( "../db/models" ).User;
const authHelper = require( "../auth/helpers.js" );


module.exports = {

  init( app ) {

    app.use( passport.initialize() );
    app.use( passport.session() );

    passport.use( new LocalStrategy(
      { usernameField: "email" },
      ( email, password, done ) => {
        User.findOne( { where: { email } } )
        .then( ( user ) => {
          if ( !user ||
               !authHelper.matchPassword( password, user.password ) ) {
            return done( null, false,
              { message: "Invalid email or password." } );
          }
          return done( null, user );
        } );
      }
    ) );

    passport.serializeUser( ( user, done ) => {
      done( null, user.id );
    } );

    passport.deserializeUser( ( id, done ) => {
      User.findByPk( id )
      .then( ( user ) => { done( null, user ); } )
      .catch( ( err ) => { done( err, user ); } );
    } );

  }
};
