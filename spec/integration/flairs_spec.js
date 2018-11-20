const server = require( "../../src/server.js" );
const base = "http://localhost:3000/flairs";

const request = require( "request" );
const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Flair = require( "../../src/db/models" ).Flair;
const palette = require( "../../src/assets/color-palette.js" );


describe( "routes.flairs", () => {

  const seeds = {
    flair: [
      {
        name: "New",
        color: palette.get( "Teal" ) // "#00796B" Teal 700
      },
      {
        name: "Popular",
        color: palette.get( "Purple" ) // "#9C27B0" Purple 500
      },
      {
        name: "Controversial",
        color: palette.get( "Red" ) // "#F44336" Red 500
      }
    ]
  };
  /* END ----- seeds ----- */


  beforeEach( ( done ) => {

    this.flair;

    const values = seeds.flair[ 0 ]; // "New"

    sequelize.sync( { force: true } ).then( ( res ) => {

      Flair.create( values )
      .then( ( flair ) => {
        this.flair = flair;
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
  } );
  /* END ----- beforeEach() ----- */


  describe( "GET /flairs", () => {

    it( "should return status code 200 AND list flairs", ( done ) => {

      const url = base;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>Flairs</h1>" );
        expect( body ).toContain( "</ul>" );
        expect( body ).toContain( seeds.flair[ 0 ].name ); // "New"
        done();
      } );
    } );

  } );
  /* END ----- GET /flairs ----- */


  describe( "GET /flairs/add", () => {

    it( "should serve page to add new flair", ( done ) => {

      const url = `${ base }/add`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>New Flair</h1>" );
        done();
      } );
    } );

  } );
  /* END ----- GET /flairs/add ----- */


  describe( "POST /flairs/create", () => {

    it( "should create new flair AND redirect", ( done ) => {

      const data = {
        url: `${ base }/create`,
        form: seeds.flair[ 1 ] // "Popular"
      };

      request.post( data, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

        Flair.findOne( { where: { name: data.form.name } } )
        .then( ( flair ) => {
          expect( flair ).not.toBeNull();
          expect( flair.name ).toBe( data.form.name ); // "Popular"
          expect( flair.color ).toBe( data.form.color ); // "#9C27B0"
          done();
        } )
        .catch( ( err ) => {
          console.log( err );
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /flairs/create ----- */


  describe( "GET /flairs/:id", () => {

    it( "should serve specified flair details", ( done ) => {

      const url = `${ base }/${ this.flair.id }`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( this.flair.name ); // "New"
        expect( body ).toContain( this.flair.color ); // "#00796B"
        done();
      } );
    } );

  } );
  /* END ----- GET /flairs/:id ----- */


  describe( "GET /flairs/:id/edit", () => {

    it( "should serve page to edit specified flair", ( done ) => {

      const url = `${ base }/${ this.flair.id }/edit`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>Edit Flair</h1>" );
        expect( body ).toContain( this.flair.name ); // "New"
        expect( body ).toContain( this.flair.color ); // "#00796B"
        done();
      } );
    } );

  } );
  /* END ----- GET /flairs/:id/edit ----- */


  describe( "POST /flairs/:id/update", () => {

    it( "should update specified flair AND redirect", ( done ) => {

      const target = this.flair; // "New"
      const before = { ...target.get() };
      const data = {
        url: `${ base }/${ target.id }/update`,
        form: {
          name: target.name,
          color: palette.get( "Light Green" ) }
      };

      request.post( data, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

        Flair.findByPk( target.id )
        .then( ( flair ) => {
          expect( flair.id ).toBe( before.id ); // unchanged
          expect( flair.name ).toBe( before.name ); // unchanged
          expect( flair.color ).not.toBe( before.color ); // !"#00796B"
          expect( flair.color ).toBe( data.form.color ); // "#558B2F"
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /flairs/:id/update ----- */


  describe( "POST /flairs/:id/delete", () => {

    it( "should delete specified flair AND redirect", ( done ) => {

      Flair.bulkCreate( seeds.flair.slice( 1 ) )
      .then( () => {

        Flair.findAll()
        .then( ( flairs ) => {
          const countBefore = flairs.length;
          expect( countBefore ).toBe( seeds.flair.length );

          const url = `${ base }/${ this.flair.id }/delete`;
          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 303 );

            Flair.findAll()
            .then( ( flairs ) => {
              expect( flairs.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );
    } );

  } );
  /* END ----- POST /flairs/:id/delete ----- */

} );
/* END ----- routes.flairs ----- */
