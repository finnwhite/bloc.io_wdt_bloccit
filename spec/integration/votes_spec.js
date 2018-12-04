const request = require( "request" );
const server = require( "../../src/server.js" );
const mockAuth = require( "../support/mock-auth.js" );

const base = "http://localhost:3000/topics";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Vote = require( "../../src/db/models" ).Vote;


describe( "routes : votes", () => {

  const UPVOTE = 1;
  const DOWNVOTE = -1;

  const seeds = {
    topics: [ {
      title: "Expeditions to Alpha Centauri",
      description: "A compilation of reports from recent visits to the star system."
    } ],
    posts: [ {
      title: "My first visit to Proxima Centauri b",
      body: "I saw some rocks."
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
    this.vote;

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

  afterEach( ( done ) => {
    mockAuth.mockSignOut( done );
  } );


  describe( "member user voting on posts", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 2 ]; // email: "member@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "member" ); // member user
        this.user = user;

        const data = { userId: user.id, email: user.email, role: user.role };
        mockAuth.mockSignIn( data, ( err, res, body ) => {
          expect( err ).toBeNull();
          done();
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
    /* END ----- beforeEach() ----- */


    describe( "GET /topics/:topicId/posts/:postId/votes/upvote", () => {

      it( "should create a new upvote", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                    `votes/upvote`;
        const options = { url };
        console.log( url );

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 303 );

          const where = { userId: this.user.id, postId: this.post.id };

          Vote.findOne( { where } )
          .then( ( vote ) => {
            expect( vote ).not.toBeNull();
            expect( vote.value ).toBe( UPVOTE );
            expect( vote.postId ).toBe( this.post.id );
            expect( vote.userId ).toBe( this.user.id );
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END --- GET /topics/:topicId/posts/:postId/votes/upvote --- */

    describe( "GET /topics/:topicId/posts/:postId/votes/downvote", () => {

      it( "should create a new downvote", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                    `votes/downvote`;
        const options = { url };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 303 );

          const where = { userId: this.user.id, postId: this.post.id };

          Vote.findOne( { where } )
          .then( ( vote ) => {
            expect( vote ).not.toBeNull();
            expect( vote.value ).toBe( DOWNVOTE );
            expect( vote.postId ).toBe( this.post.id );
            expect( vote.userId ).toBe( this.user.id );
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END --- GET /topics/:topicId/posts/:postId/votes/downvote --- */

  } );
  /* END ----- member user voting on posts ----- */


  describe( "guest user voting on posts", () => {

    beforeEach( ( done ) => {
      mockAuth.mockSignOut( done );
    } );

    describe( "GET /topics/:topicId/posts/:postId/votes/upvote", () => {

      it( "should NOT create a new upvote", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                    `votes/upvote`;
        const options = { url };

        request.post( options, ( err, res, body ) => { // FORBIDDEN!
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          const where = { userId: this.user.id, postId: this.post.id };

          Vote.findOne( { where } )
          .then( ( vote ) => {
            expect( vote ).toBeNull();
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END --- GET /topics/:topicId/posts/:postId/votes/upvote --- */

  } );
  /* END ----- guest user voting on posts ----- */

} );
/* END ----- routes : votes ----- */
