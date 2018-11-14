const server = require( "../../src/server.js" );
const base = "http://localhost:3000/advertisements/";

const request = require( "request" );
const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Advertisement = require( "../../src/db/models" ).Advertisement;

describe( "routes.advertisements", () => {

  const seeds = [
    {
      title: "Bloc",
      description: "Structured, online training programs in software development and design for career-minded adults with busy lives."
    },
    {
      title: "Dollar Shave Club",
      description: "Get Ready to look, feel and smell your best."
    },
    {
      title: "Blue Apron",
      description: "Hold on! Take $60 off spread over your next three orders"
    }
  ];

  beforeEach( ( done ) => {
    this.advert = null;
    sequelize.sync( { force: true } )
    .then( () => {
      Advertisement.create( seeds[0] )
      .then( ( advert ) => {
        this.advert = advert;
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
  } );


  describe( "GET /advertisements", () => {

    it( "should return status code 200 AND list advertisements", ( done ) => {
      done();
    } );

  } );
  /* END ----- GET /advertisements ----- */


  describe( "GET /advertisements/add", () => {

    it( "should serve page to add new advertisement", ( done ) => {
      done();
    } );

  } );
  /* END ----- GET /advertisements/add ----- */


  describe( "POST /advertisements/create", () => {

    it( "should create new advertisement AND redirect", ( done ) => {
      done();
    } );


  } );
  /* END ----- POST /advertisements/create ----- */


  describe( "GET /advertisements/:id", () => {

    it( "should serve specified advertisement details", ( done ) => {
      done();
    } );

  } );
  /* END ----- GET /advertisements/:id ----- */


  describe( "GET /advertisements/:id/edit", () => {

    it( "should serve page to edit specified advertisement", ( done ) => {
      done();
    } );

  } );
  /* END ----- GET /advertisements/:id/edit ----- */


  describe( "POST /advertisements/:id/update", () => {

    it( "should update specified advertisement AND redirect", ( done ) => {
      done();
    } );

  } );
  /* END ----- POST /advertisements/:id/update ----- */


  describe( "POST /advertisements/:id/delete", () => {

    it( "should delete specified advertisement AND redirect", ( done ) => {
      done();
    } );

  } );
  /* END ----- POST /advertisements/:id/delete ----- */

} );
/* END ----- routes.advertisements ----- */
