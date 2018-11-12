const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/";

describe( "routes : static", () => {

  describe( "GET /", () => {

    const url = base;
    const match = "Welcome to Bloccit!";

    it( `should return status code 200 AND ` +
        `have "${ match }" in the body of the response`, ( done ) => {
      request.get( url, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( match );
        done();
      } );
    } );

  } );
  /* ----- GET / ----- */

  describe( "GET /marco", () => {

    const url = base + "marco";

    it( `should return body containing string "polo"`, ( done ) => {
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
