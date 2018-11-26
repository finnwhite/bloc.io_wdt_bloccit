const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/users";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;


describe( "routes : users", () => {

  const seeds = {
    users: [ {
      email: "user@example.com",
      password: "123456789"
    }, {
      email: "no",
      password: "123456789"
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


  describe( "GET /users/sign_up", () => {

    it( "should render a view with a sign up form", ( done ) => {

      const url = `${ base }/sign_up`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>Sign up</h1>" );
        done();
      } );
    } );

  } );
  /* END ----- GET /users/sign_up ----- */


  describe( "POST /users", () => {

    it( "should create a new User when sent valid values " +
        "AND redirect", ( done ) => {

      const data = {
        url: base,
        form: seeds.users[ 0 ] // email: "user@example.com"
      };

      request.post( data, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 302 );

        User.findOne( { where: { email: data.form.email } } )
        .then( ( user ) => {
          expect( user ).not.toBeNull();
          expect( user.email ).toBe( data.form.email ); // "user@example.com"
          expect( user.password ).not.toBe( data.form.password ); // ENCRYPTED!
          expect( user.id ).toBe( 1 );
          done();
        } )
        .catch( ( err ) => {
          console.log( err );
          done();
        } );
      } );
    } );


    it( "should NOT create a new User when sent INVALID values " +
        "AND redirect", ( done ) => {

      const data = {
        url: base,
        form: seeds.users[ 1 ] // email: "no"
      };

      request.post( data, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 302 );

        User.findOne( { where: { email: data.form.email } } )
        .then( ( user ) => {
          expect( user ).toBeNull();
          done();
        } )
        .catch( ( err ) => {
          console.log( err );
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /users ----- */


  describe( "GET /users/sign_in", () => {

    it( "should render a view with a sign in form", ( done ) => {

      const url = `${ base }/sign_in`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>Sign in</h1>" );
        done();
      } );
    } );

  } );
  /* END ----- GET /users/sign_in ----- */

} );
/* END ----- routes : users ----- */
