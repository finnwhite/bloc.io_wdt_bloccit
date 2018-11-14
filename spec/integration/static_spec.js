const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/";

describe( "routes : static", () => {

  describe( "GET /", () => {

    const match = "Welcome to Bloccit";
    it( `should return status code 200 AND ` +
        `have "${ match }" in the body of the response`, ( done ) => {
      request.get( base, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( match );
        done();
      } );
    } );

  } );
  /* END ----- GET / ----- */

  describe( "GET /about", () => {

    const match = "About Us";
    it( `should return body containing the string "${ match }"`, ( done ) => {
      request.get( `${ base }about`, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( match );
        done();
      } );
    } );

  } );
  /* END ----- GET /about ----- */

  describe( "GET /marco", () => {

    const match = "polo";
    it( `should return body containing the string "${ match }"`, ( done ) => {
      request.get( `${ base }marco`, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( body.toLowerCase() ).toContain( match );
        done();
      } );
    } );

  } );
  /* END ----- GET /marco ----- */

} );
/* END ----- routes : static ----- */
