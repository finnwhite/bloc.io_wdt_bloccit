const request = require( "request" );
const server = require( "../../src/server.js" );
const mockAuth = require( "../support/mock-auth.js" );

const base = "http://localhost:3000/topics";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Favorite = require( "../../src/db/models" ).Favorite;


describe( "routes : favorites", () => {

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
          this.post = topic.posts[ 0 ]; // +upvote +favorite
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


  describe( "member user favoriting posts", () => {

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


    describe( "POST /topics/:topicId/posts/:postId/" +
              "favorites/create", () => {

      it( "should create a new favorite", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                    `favorites/create`;
        const options = { url };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          const where = { userId: this.user.id, postId: this.post.id };

          Favorite.findOne( { where } )
          .then( ( favorite ) => {
            expect( favorite ).not.toBeNull();
            expect( favorite.postId ).toBe( this.post.id );
            expect( favorite.userId ).toBe( this.user.id );
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END -- POST /topics/:topicId/posts/:postId/favorites/create -- */

    describe( "POST /topics/:topicId/posts/:postId/" +
              "favorites/:id/destroy", () => {

      it( "should delete the favorite", ( done ) => {

        const values = { userId: this.user.id, postId: this.post.id };

        Favorite.create( values )
        .then( ( favorite ) => {
          expect( favorite ).not.toBeNull();

          Favorite.findAll()
          .then( ( favorites ) => {
            const countBefore = favorites.length;
            expect( countBefore ).toBeGreaterThan( 0 );

            const url = `${ base }/${ this.topic.id }/posts/` +
                        `${ this.post.id }/favorites/` +
                        `${ favorite.id }/destroy`;
            const options = { url };

            request.post( options, ( err, res, body ) => {
              expect( err ).toBeNull();
              expect( res.statusCode ).toBe( 302 );

              Favorite.findAll()
              .then( ( favorites ) => {
                expect( favorites.length ).toBe( countBefore - 1 );
                done();
              } );
            } );
          } );
        } );
      } );

    } );
    /* END -- POST /topics/:topicId/posts/:postId/favorites/:id/destroy -- */

  } );
  /* END ----- member user favoriting posts ----- */


  describe( "guest user favoriting posts", () => {

    beforeEach( ( done ) => {
      mockAuth.mockSignOut( done );
    } );

    describe( "POST /topics/:topicId/posts/:postId/" +
              "favorites/create", () => {

      it( "should NOT create a new favorite", ( done ) => {

        Favorite.findAll()
        .then( ( favorites ) => {
          const countBefore = favorites.length;
          expect( countBefore ).toBeGreaterThanOrEqual( 0 );

          const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/` +
                      `favorites/create`;
          const options = { url };

          request.post( options, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );

            Favorite.findAll()
            .then( ( favorites ) => {
              expect( favorites.length ).toBe( countBefore ); // unchanged
              done();
            } );
          } );
        } );
      } );

    } );
    /* END -- POST /topics/:topicId/posts/:postId/favorites/create -- */

  } );
  /* END ----- guest user favoriting posts ----- */

} );
/* END ----- routes : favorites ----- */
