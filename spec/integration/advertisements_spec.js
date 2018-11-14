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
      const url = base;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "Advertisements" );
        expect( body ).toContain( "</ul>" );
        expect( body ).toContain( seeds[0].title );
        done();
      } );
    } );

  } );
  /* END ----- GET /advertisements ----- */


  describe( "GET /advertisements/add", () => {

    it( "should serve page to add new advertisement", ( done ) => {
      const url = `${ base }add`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "New Advertisement" );
        done();
      } );
    } );

  } );
  /* END ----- GET /advertisements/add ----- */


  describe( "POST /advertisements/create", () => {

    it( "should create new advertisement AND redirect", ( done ) => {
      const data = { url: `${ base }create`, form: seeds[1] };
      request.post( data, ( err, res, body ) => {
        Advertisement.findOne( { where: { title: data.form.title } } )
        .then( ( advert ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 303 );
          expect( advert.title ).toBe( data.form.title );
          expect( advert.description ).toBe( data.form.description );
          done();
        } )
        .catch( ( err ) => {
          console.log( err );
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /advertisements/create ----- */


  describe( "GET /advertisements/:id", () => {

    it( "should serve specified advertisement details", ( done ) => {
      const url = `${ base }${ this.advert.id }`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( this.advert.title );
        done();
      } );
    } );

  } );
  /* END ----- GET /advertisements/:id ----- */


  describe( "GET /advertisements/:id/edit", () => {

    it( "should serve page to edit specified advertisement", ( done ) => {
      const url = `${ base }${ this.advert.id }/edit`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "Edit Advertisement" );
        expect( body ).toContain( this.advert.title );
        done();
      } );
    } );

  } );
  /* END ----- GET /advertisements/:id/edit ----- */


  describe( "POST /advertisements/:id/update", () => {

    it( "should update specified advertisement AND redirect", ( done ) => {
      const prev = { ...this.advert };
      const data = {
        url: `${ base }${ this.advert.id }/update`,
        form: {
          title: "bloc.io",
          description: "Designed for beginners, focused on outcomes."
        }
      };
      request.post( data, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );
        Advertisement.findOne( { where: { id: this.advert.id } } )
        .then( ( advert ) => {
          expect( advert.title ).not.toBe( prev.title );
          expect( advert.title ).toBe( data.form.title );
          expect( advert.description ).not.toBe( prev.description );
          expect( advert.description ).toBe( data.form.description );
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /advertisements/:id/update ----- */


  describe( "POST /advertisements/:id/delete", () => {

    it( "should delete specified advertisement AND redirect", ( done ) => {
      Advertisement.bulkCreate( seeds.slice(1) )
      .then( () => {
        Advertisement.findAll()
        .then( ( adverts ) => {
          const countBefore = adverts.length;
          expect( countBefore ).toBe( seeds.length );

          const url = `${ base }${ this.advert.id }/delete`;
          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 303 );
            Advertisement.findAll()
            .then( ( adverts ) => {
              expect( adverts.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );
    } );

  } );
  /* END ----- POST /advertisements/:id/delete ----- */

} );
/* END ----- routes.advertisements ----- */
