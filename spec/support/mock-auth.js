const request = require( "request" );
const mockAuthUrl = "http://localhost:3000/auth/mock";

module.exports = {

  init( app ) {

    let id, email, role;

    function middleware( req, res, next ) {

      id = req.body.userId || id;
      email = req.body.email || email;
      role = req.body.role || role;

      if ( id && ( id != 0 ) ) { req.user = { id, email, role }; }
      else if ( id == 0 ) {  // sign out
        delete req.user;
        role = email = id = null;
      }

      if ( next ) { next(); }
    }

    function route( req, res, next ) {
      res.redirect( 303, "/" );
    }

    app.use( middleware );
    app.get( "/auth/mock", route );
  }
  ,

  mockSignOut( callback ) {
    const options = { url: mockAuthUrl, form: { userId: 0 } };
    request.get( options, callback );
  }
  ,
  mockSignIn( user, callback ) {
    const options = { url: mockAuthUrl, form: user };
    request.get( options, callback );
  }

};
