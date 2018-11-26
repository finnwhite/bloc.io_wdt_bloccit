const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;


describe( "User", () => {

  const seeds = {
    users: [ {
      email: "user@example.com",
      password: "1234567890"
    }, {
      email: "It's-a me, Mario!",
      password: "1234567890"
    }, {
      email: "user@example.com",
      password: "nananananananananananananananana BATMAN!"
    } ]
  };
  /* END ----- seeds ----- */

  beforeEach( ( done ) => {
    sequelize.sync( { force: true } )
    .then( () => { done(); } )
    .catch( ( err ) => {
      console.log( err );
      done();
    } );
  } );
  /* END ----- beforeEach() ----- */


  describe( ".create()", () => {

    it( "should create User when supplied with " +
        "valid email and password", ( done ) => {

      const values = seeds.users[ 0 ]; // email: "user@example.com"

      User.create( values )
      .then( ( user ) => {
        expect( user.email ).toBe( values.email ); // "user@example.com"
        expect( user.password ).toBe( values.password ); // "1234567890"
        expect( user.id ).toBe( 1 );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );


    it( "should NOT create User when supplied with " +
        "INVALID email or password", ( done ) => {

      const values = seeds.users[ 1 ]; // email: "It's-a me, Mario!"

      User.create( values )
      .then( ( user ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "Validation error" );
        expect( err.message ).toContain( "must be a valid email address" );
        done();
      } );
    } );


    it( "should NOT create User when supplied with " +
        "email already in use", ( done ) => {

      const valuesA = seeds.users[ 0 ]; // email: "user@example.com"
      const valuesB = seeds.users[ 2 ]; // email: "user@example.com"

      User.create( valuesA )
      .then( ( userA ) => {
        expect( userA ).not.toBeNull();

        User.create( valuesB )
        .then( ( userB ) => { // should never succeed, execute
          done();
        } )
        .catch( ( err ) => {
          //console.log( err );
          expect( err.message ).toContain( "Validation error" );
          expect( err.errors[ 0 ].message ).toContain( "email must be unique" );
          expect( err.original.detail ).toContain( valuesB.email );
          expect( err.original.detail ).toContain( "already exists" );
          done();
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- User.create() ----- */

} );
/* END ----- User ----- */
