const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Flair = require( "../../src/db/models" ).Flair;
const palette = require( "../../src/assets/color-palette.js" );


describe( "Flair", () => {

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


  describe( ".create()", () => {

    const values = seeds.flair[ 1 ]; // "Popular"

    it( "should create Flair instance with specified values", ( done ) => {

      Flair.create( values )
      .then( ( flair ) => {
        expect( flair.name ).toBe( values.name ); // "Popular"
        expect( flair.color ).toBe( values.color ); // "#9C27B0"
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create Flair instance if missing values", ( done ) => {

      Flair.create( { color: values.color } )
      .then( ( flair ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "Flair.name cannot be null" );
        done();
      } );
    } );

  } );
  /* END ----- Flair.create() ----- */


  describe( ".find()", () => {

    it( "should return Flair instance with specified ID", ( done ) => {

      const target = this.flair; // "New"

      Flair.findByPk( target.id )
      .then( ( flair ) => {
        expect( flair.id ).toBe( target.id );
        expect( flair.name ).toBe( target.name ); // "New"
        expect( flair.color ).toBe( target.color ); // "#00796B"
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Flair.find() ----- */


  describe( ".update()", () => {

    it( "should update specified Flair instance " +
        "with specified values", ( done ) => {

      const target = this.flair; // "New"
      const before = { ...target.get() };
      const updates = { color: palette.get( "Light Green" ) };

      Flair.update( updates, {
        where: { id: target.id },
        fields: Object.keys( updates )
      } )
      .then( ( affected ) => {
        expect( affected[ 0 ] ).toBe( 1 );

        Flair.findByPk( target.id )
        .then( ( flair ) => {
          expect( flair.id ).toBe( before.id ); // unchanged
          expect( flair.name ).toBe( before.name ); // unchanged
          expect( flair.color ).not.toBe( before.color ); // !"#00796B"
          expect( flair.color ).toBe( updates.color ); // "#558B2F"
          done();
        } )
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Flair.update() ----- */


  describe( ".destroy()", () => {

    it( "should delete specified Flair instance", ( done ) => {

      const target = this.flair; // "New"
      const before = { ...target.get() };

      Flair.destroy( { where: { id: target.id } } )
      .then( ( destroyedCount ) => {
        expect( destroyedCount ).toBe( 1 );

        Flair.findByPk( before.id )
        .then( ( flair ) => {
          expect( flair ).toBeNull();
          done();
        } )
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Flair.destroy() ----- */

} );
/* END ----- Flair ----- */
