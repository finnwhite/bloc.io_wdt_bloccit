const request = require( "request" );
const server = require( "../../src/server.js" );
const base = server.base;

describe( "routes : static", () => {

  describe( "GET /", () => {

    const url = base;

    it( "should return status code 200", ( done ) => {
      request.get( url, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        done();
      } );
    } );

  } );
  /* ----- GET / ----- */

  describe( "GET /marco", () => {

    const url = base + "marco";

    it( "should return body containing string \"polo\"", ( done ) => {
      request.get( url, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( body.toLowerCase() ).toContain( "polo" );
        done();
      } );
    } );

  } );
  /* ----- GET /marco ----- */

} );
/* ----- routes : static ----- */
