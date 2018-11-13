const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/topics/";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;

describe( "routes : topics", () => {

  beforeEach( ( done ) => {
    this.topic;
    sequelize.sync( { force: true } )
    .then( ( res ) => {
      Topic.create( {
        title: "JS Frameworks",
        description: "There are a lot of them."
      } )
      .then( ( topic ) => {
        this.topic = topic;
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
  } );

  describe( "GET /topics", () => {

    const url = base;

    it( `should return status code 200 AND all topics`, ( done ) => {
      request.get( url, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( err ).toBeNull();
        expect( body ).toContain( "Topics" );
        expect( body ).toContain( "JS Frameworks" );
        done();
      } );
    } );

  } );
  /* END ----- GET /topics ----- */

} );
/* END ----- routes : topics ----- */
