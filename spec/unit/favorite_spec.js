const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Favorite = require( "../../src/db/models" ).Favorite;


describe( "Favorite", () => {

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
    users: [ {
      email: "starman@tesla.com",
      password: "Trekkie4lyfe"
    }, {
      email: "bob@example.com",
      password: "password"
    } ]
  };
  /* END ----- seeds ----- */

  beforeEach( ( done ) => {
    this.user;
    this.topic;
    this.post;
    this.favorite;

    sequelize.sync( { force: true } ).then( ( res ) => {

      const values = seeds.users[ 0 ]; // email: "starman@tesla.com"

      User.create( values )
      .then( ( user ) => {
        this.user = user;

        const values = { ...seeds.topics[ 0 ] }; // "...Alpha Centauri"
        values.posts = [ { ...seeds.posts[ 0 ] } ]; // "...Proxima Centauri b"
        values.posts[ 0 ].userId = user.id;

        Topic.create( values, { include: { model: Post, as: "posts" } } )
        .then( ( topic ) => {
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


  describe( ".create()", () => {

    it( "should create a favorite by the specified user " +
        "for the specified post", ( done ) => {

      const values = {
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Favorite.create( values )
      .then( ( favorite ) => {
        expect( favorite.postId ).toBe( values.postId );
        expect( favorite.userId ).toBe( values.userId );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create a favorite with missing post or user", ( done ) => {

      Favorite.create( { userId: null } )
      .then( ( favorite ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "Favorite.postId cannot be null" );
        expect( err.message ).toContain( "Favorite.userId cannot be null" );
        done();
      } );
    } );

  } );
  /* END ----- Favorite.create() ----- */


  describe( ".setPost()", () => {

    it( "should associate favorite with specified post", ( done ) => {

      const values = {
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Favorite.create( values )
      .then( ( favorite ) => {
        expect( favorite ).not.toBeNull();

        const oldPost = this.post;
        expect( favorite.postId ).toBe( oldPost.id );

        const values = { ...seeds.posts[ 1 ] }; // "Dress code on Proxima b"
        values.topicId = this.topic.id;
        values.userId = this.user.id;

        Post.create( values )
        .then( ( newPost ) => {

          favorite.setPost( newPost )
          .then( ( favorite ) => {
            expect( favorite.postId ).not.toBe( oldPost.id );
            expect( favorite.postId ).toBe( newPost.id ); // updated
            done();
          } );
        } );
      } );
    } );

  } );
  /* END ----- Favorite.setPost() ----- */

  describe( ".getPost()", () => {

    it( "should return the associated post", ( done ) => {

      const values = {
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Favorite.create( values )
      .then( ( favorite ) => {
        expect( favorite ).not.toBeNull();

        favorite.getPost()
        .then( ( post ) => {
          expect( post.id ).toBe( this.post.id );
          expect( post.title ).toBe( this.post.title );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Favorite.getPost() ----- */


  describe( ".setUser()", () => {

    it( "should associate favorite with the specified user", ( done ) => {

      const values = {
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Favorite.create( values )
      .then( ( favorite ) => {
        expect( favorite ).not.toBeNull();

        const oldUser = this.user;
        expect( favorite.userId ).toBe( oldUser.id );

        const values = seeds.users[ 1 ]; // email: "bob@example.com"

        User.create( values )
        .then( ( newUser ) => {

          favorite.setUser( newUser )
          .then( ( favorite ) => {
            expect( favorite.userId ).not.toBe( oldUser.id );
            expect( favorite.userId ).toBe( newUser.id ); // updated
            done();
          } );
        } );
      } );
    } );

  } );
  /* END ----- Favorite.setUser() ----- */

  describe( ".getUser()", () => {

    it( "should return the associated user", ( done ) => {

      const values = {
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Favorite.create( values )
      .then( ( favorite ) => {
        expect( favorite ).not.toBeNull();

        favorite.getUser()
        .then( ( user ) => {
          expect( user.id ).toBe( this.user.id );
          expect( user.email ).toBe( this.user.email ); // "starman"
          done();
        } );
      } );
    } );

  } );
  /* END ----- Favorite.getUser() ----- */

} );
/* END ----- Favorite ----- */
