const request = require( "request" );
const server = require( "../../src/server.js" );
const mockAuth = require( "../support/mock-auth.js" );

const base = "http://localhost:3000/topics";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Comment = require( "../../src/db/models" ).Comment;


describe( "routes : comments", () => {

  const seeds = {
    topics: [ {
      title: "Expeditions to Alpha Centauri",
      description: "A compilation of reports from recent visits to the star system."
    } ],
    posts: [ {
      title: "My first visit to Proxima Centauri b",
      body: "I saw some rocks."
    }, {
      title: "Dress code on Proxima b",
      body: "Spacesuit, space helmet, space boots, and space gloves"
    } ],
    comments: [ {
      body: "ay caramba!!!!!"
    }, {
      body: "The geological kind."
    }, {
      body: "Are the inertial dampers still engaged?"
    }, {
      body: "...it was a rock lobster!"
    }, {
      body: "This comment is amazing!"
    } ],
    users: [ {
      email: "starman@tesla.com",
      password: "Trekkie4lyfe",
      role: "admin"
    }, {
      email: "admin@example.com",
      password: "123456",
      role: "admin"
    }, {
      email: "member@example.com",
      password: "123456",
      role: "member"
    } ]
  };
  /* END ----- seeds ----- */

  beforeAll( ( done ) => {
    mockAuth.mockSignOut( done );
  } );

  beforeEach( ( done ) => {
    this.user;
    this.topic;
    this.post;
    this.comment = { member: null, owner: null };

    sequelize.sync( { force: true } ).then( ( res ) => {

      const values = seeds.users[ 0 ]; // email: "starman@tesla.com"

      User.create( values )
      .then( ( user ) => {
        expect( user ).not.toBeNull();

        const values = { ...seeds.topics[ 0 ] }; // "...Alpha Centauri"
        values.posts = [ { ...seeds.posts[ 0 ] } ]; // "...Proxima Centauri b"
        values.posts[ 0 ].userId = user.id;

        Topic.create( values, { include: { model: Post, as: "posts" } } )
        .then( ( topic ) => {
          expect( topic ).not.toBeNull();
          this.topic = topic;
          this.post = topic.posts[ 0 ];

          const values = { ...seeds.comments[ 0 ] }; // "ay caramba!!!!!"
          values.postId = this.post.id;
          values.userId = user.id;

          Comment.create( values )
          .then( ( comment ) => {
            this.comment.member = comment; // owned by "another member"
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );
    } );
  } );
  /* END ----- beforeEach() ----- */

  afterEach( ( done ) => {
    mockAuth.mockSignOut( done );
  } );


  describe( "admin user CRUD operations", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 1 ]; // email: "admin@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "admin" ); // admin user
        this.user = user;

        const values = { ...seeds.comments[ 3 ] }; // "...rock lobster!"
        values.postId = this.post.id;
        values.userId = user.id;

        Comment.create( values )
        .then( ( comment ) => {
          expect( comment ).not.toBeNull();
          this.comment.owner = comment; // owned by member

          const data = { userId: user.id, email: user.email, role: user.role };
          mockAuth.mockSignIn( data, ( err, res, body ) => {
            expect( err ).toBeNull();
            done();
          } );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
    /* END ----- beforeEach() ----- */


    describe( "POST /topics/:topicId/posts/:postId" +
              "/comments/create", () => {

      it( "should NOT create a new comment " +
          "that fails validations", ( done ) => {

        Comment.findAll()
        .then( ( comments ) => {
          const countBefore = comments.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `comments/create`;
          const values = { body: "" } // INVALID!
          const options = { url: url, form: values };

          request.post( options, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );

            Comment.findAll()
            .then( ( comments ) => {
              expect( comments.length ).toBe( countBefore ); // unchanged
              done();
            } );
          } );
        } );
      } );

    } );
    /* END --- POST /topics/:topicId/posts/:postId/comments/create --- */


    describe( "POST /topics/:topicId/posts/:postId" +
              "/comments/:id/destroy", () => {

      it( "should delete a comment owned by the user", ( done ) => {

        Comment.findAll()
        .then( ( comments ) => {
          const countBefore = comments.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const comment = this.comment.owner; // "...rock lobster!"
          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `comments/${ comment.id }/destroy`;

          expect( comment.userId ).toBe( this.user.id );

          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 303 );

            Comment.findAll()
            .then( ( comments ) => {
              expect( comments.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );

      it( "should delete a comment owned by another user", ( done ) => {

        Comment.findAll()
        .then( ( comments ) => {
          const countBefore = comments.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const comment = this.comment.member; // "ay caramba!!!!!"
          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `comments/${ comment.id }/destroy`;

          expect( comment.userId ).not.toBe( this.user.id );

          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 303 );

            Comment.findAll()
            .then( ( comments ) => {
              expect( comments.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );

    } );
    /* END --- POST /topics/:topicId/posts/:postId/comments/:id/destroy --- */

  } );
  /* END ----- admin user CRUD operations ----- */


  describe( "member user CRUD operations", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 2 ]; // email: "member@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "member" ); // member user
        this.user = user;

        const values = { ...seeds.comments[ 3 ] }; // "...rock lobster!"
        values.postId = this.post.id;
        values.userId = user.id;

        Comment.create( values )
        .then( ( comment ) => {
          expect( comment ).not.toBeNull();
          this.comment.owner = comment; // owned by member

          const data = { userId: user.id, email: user.email, role: user.role };
          mockAuth.mockSignIn( data, ( err, res, body ) => {
            expect( err ).toBeNull();
            done();
          } );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
    /* END ----- beforeEach() ----- */


    describe( "POST /topics/:topicId/posts/:postId" +
              "/comments/create", () => {

      it( "should create a new comment AND redirect", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                    `comments/create`;
        const values = seeds.comments[ 4 ]; // "This comment is amazing!"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 303 );

          Comment.findOne( { where: { body: values.body } } )
          .then( ( comment ) => {
            expect( comment ).not.toBeNull();
            expect( comment.body ).toBe( values.body );
            expect( comment.postId ).toBe( this.post.id );
            expect( comment.userId ).toBe( this.user.id );
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END --- POST /topics/:topicId/posts/:postId/comments/create --- */


    describe( "POST /topics/:topicId/posts/:postId" +
              "/comments/:id/destroy", () => {

      it( "should delete a comment owned by the user", ( done ) => {

        Comment.findAll()
        .then( ( comments ) => {
          const countBefore = comments.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const comment = this.comment.owner; // "...rock lobster!"
          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `comments/${ comment.id }/destroy`;

          expect( comment.userId ).toBe( this.user.id );

          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 303 );

            Comment.findAll()
            .then( ( comments ) => {
              expect( comments.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );

      it( "should NOT delete a comment owned by another user", ( done ) => {

        Comment.findAll()
        .then( ( comments ) => {
          const countBefore = comments.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const comment = this.comment.member; // "ay caramba!!!!!"
          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `comments/${ comment.id }/destroy`;

          expect( comment.userId ).not.toBe( this.user.id ); // FORBIDDEN!

          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );

            Comment.findAll()
            .then( ( comments ) => {
              expect( comments.length ).toBe( countBefore ); // unchanged
              done();
            } );
          } );
        } );
      } );

    } );
    /* END --- POST /topics/:topicId/posts/:postId/comments/:id/destroy --- */

  } );
  /* END ----- member user CRUD operations ----- */


  describe( "guest user CRUD operations", () => {

    beforeEach( ( done ) => {
      mockAuth.mockSignOut( done );
    } );

    describe( "POST /topics/:topicId/posts/:postId" +
              "/comments/create", () => {

      it( "should NOT create a new comment", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                    `comments/create`;
        const values = seeds.comments[ 4 ]; // "This comment is amazing!"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => { // FORBIDDEN!
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Comment.findOne( { where: { body: values.body } } )
          .then( ( comment ) => {
            expect( comment ).toBeNull();
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END --- POST /topics/:topicId/posts/:postId/comments/create --- */


    describe( "POST /topics/:topicId/posts/:postId" +
              "/comments/:id/destroy", () => {

      it( "should NOT delete the specified comment", ( done ) => {

        Comment.findAll()
        .then( ( comments ) => {
          const countBefore = comments.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const comment = this.comment.member; // "ay caramba!!!!!"
          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `comments/${ comment.id }/destroy`;

          request.post( url, ( err, res, body ) => { // FORBIDDEN!
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );

            Comment.findAll()
            .then( ( comments ) => {
              expect( comments.length ).toBe( countBefore ); // unchanged
              done();
            } );
          } );
        } );
      } );

    } );
    /* END --- POST /topics/:topicId/posts/:postId/comments/:id/destroy --- */

  } );
  /* END ----- guest user CRUD operations ----- */

} );
/* END ----- routes : comments ----- */
