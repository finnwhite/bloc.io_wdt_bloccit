const request = require( "request" );
const server = require( "../../src/server.js" );

const base = "http://localhost:3000/users";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Comment = require( "../../src/db/models" ).Comment;


describe( "routes : users", () => {

  const seeds = {
    topics: [ {
      title: "Winter Games",
      description: "Post your Winter Games stories."
    } ],
    posts: [ {
      title: "Snowball Fighting",
      body: "So much snow!"
    } ],
    comments: [ {
      body: "This comment is alright."
    } ],
    users: [ {
      email: "user@example.com",
      password: "123456789"
    }, {
      email: "no",
      password: "123456789"
    }, {
      email: "starman@tesla.com",
      password: "Trekkie4lyfe"
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

      const values = seeds.users[ 0 ] // email: "user@example.com"
      const options = { url: base, form: values };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 302 );

        User.findOne( { where: { email: options.form.email } } )
        .then( ( user ) => {
          expect( user ).not.toBeNull();
          expect( user.email ).toBe( options.form.email ); // "user@example.com"
          expect( user.password ).not.toBe( options.form.password ); // HASH!
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

      const values = seeds.users[ 1 ] // email: "no"
      const options = { url: base, form: values };

      request.post( options, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 302 );

        User.findOne( { where: { email: options.form.email } } )
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


  describe( "GET /users/:id", () => {

    beforeEach( ( done ) => {
      this.user;
      this.post;
      this.comment;

      const values = seeds.users[ 2 ]; // email: "starman@tesla.com"

      User.create( values )
      .then( ( user ) => {
        this.user = user;

        const values = { ...seeds.topics[ 0 ] }; // "Winter Games"
        values.posts = [ { ...seeds.posts[ 0 ] } ]; // "Snowball Fighting"
        values.posts[ 0 ].userId = user.id;

        Topic.create( values, { include: { model: Post, as: "posts" } } )
        .then( ( topic ) => {
          this.post = topic.posts[ 0 ];

          const values = { ...seeds.comments[ 0 ] }; // "...alright."
          values.postId = this.post.id;
          values.userId = user.id;

          Comment.create( values )
          .then( ( comment ) => {
            this.comment = comment;
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );
    } );
    /* END ----- beforeEach() ----- */

    it( "should render a view with a list of comments and posts" +
        "created by the specified user", ( done ) => {

      const url = `${ base }/${ this.user.id }`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( this.user.email ); // "starman@tesla.com"
        expect( body ).toContain( this.post.title ); // "Snowball Fighting"
        expect( body ).toContain( this.comment.body ); // "...alright."
        done();
      } );
    } );

  } );
  /* END ----- GET /users/:id ----- */

} );
/* END ----- routes : users ----- */
