const request = require( "request" );
const server = require( "../../src/server.js" );
const base = server.base;

describe( "routes : static", () => {

  describe( "GET /", () => {

    it( "should return status code 200", ( done ) => {
      request.get( base, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        done();
      } );
    } );

  } );
  /* ----- GET / ----- */

} );
/* ----- routes : static ----- */
