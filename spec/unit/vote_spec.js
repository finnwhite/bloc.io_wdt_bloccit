const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Vote = require( "../../src/db/models" ).Vote;


describe( "Vote", () => {

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
    this.vote;

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

    it( "should create an upvote by the specified user " +
        "for the specified post", ( done ) => {

      const values = {
        value: UPVOTE,
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => {
        expect( vote.value ).toBe( UPVOTE );
        expect( vote.postId ).toBe( values.postId );
        expect( vote.userId ).toBe( values.userId );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should create a downvote by the specified user " +
        "for the specified post", ( done ) => {

      const values = {
        value: DOWNVOTE,
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => {
        expect( vote.value ).toBe( DOWNVOTE );
        expect( vote.postId ).toBe( values.postId );
        expect( vote.userId ).toBe( values.userId );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create a vote with missing post or user", ( done ) => {

      Vote.create( { value: UPVOTE } )
      .then( ( vote ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "Vote.postId cannot be null" );
        expect( err.message ).toContain( "Vote.userId cannot be null" );
        done();
      } );
    } );

    it( "should NOT create a vote " +
        "with a value other than 1 or -1", ( done ) => {

      const values = {
        value: 0, // INVALID!
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "Validation isIn on value failed" );

        const values = {
          value: 5, // INVALID!
          postId: this.post.id,
          userId: this.user.id,
        };

        Vote.create( values )
        .then( ( vote ) => { // should never succeed, execute
          done();
        } )
        .catch( ( err ) => {
          expect( err.message ).toContain( "Validation isIn on value failed" );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Vote.create() ----- */


  describe( ".setPost()", () => {

    it( "should associate vote with specified post", ( done ) => {

      const values = {
        value: UPVOTE,
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => {
        expect( vote ).not.toBeNull();

        const oldPost = this.post;
        expect( vote.postId ).toBe( oldPost.id );

        const values = { ...seeds.posts[ 1 ] }; // "Dress code on Proxima b"
        values.topicId = this.topic.id;
        values.userId = this.user.id;

        Post.create( values )
        .then( ( newPost ) => {

          vote.setPost( newPost )
          .then( ( vote ) => {
            expect( vote.postId ).not.toBe( oldPost.id );
            expect( vote.postId ).toBe( newPost.id ); // updated
            done();
          } );
        } );
      } );
    } );

  } );
  /* END ----- Vote.setPost() ----- */

  describe( ".getPost()", () => {

    it( "should return the associated post", ( done ) => {

      const values = {
        value: UPVOTE,
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => {
        expect( vote ).not.toBeNull();

        vote.getPost()
        .then( ( post ) => {
          expect( post.id ).toBe( this.post.id );
          expect( post.title ).toBe( this.post.title );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Vote.getPost() ----- */


  describe( ".setUser()", () => {

    it( "should associate vote with the specified user", ( done ) => {

      const values = {
        value: UPVOTE,
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => {
        expect( vote ).not.toBeNull();

        const oldUser = this.user;
        expect( vote.userId ).toBe( oldUser.id );

        const values = seeds.users[ 1 ]; // email: "bob@example.com"

        User.create( values )
        .then( ( newUser ) => {

          vote.setUser( newUser )
          .then( ( vote ) => {
            expect( vote.userId ).not.toBe( oldUser.id );
            expect( vote.userId ).toBe( newUser.id ); // updated
            done();
          } );
        } );
      } );
    } );

  } );
  /* END ----- Vote.setUser() ----- */

  describe( ".getUser()", () => {

    it( "should return the associated user", ( done ) => {

      const values = {
        value: UPVOTE,
        postId: this.post.id, // "...Proxima Centauri b"
        userId: this.user.id, // email: "starman@tesla.com"
      };

      Vote.create( values )
      .then( ( vote ) => {
        expect( vote ).not.toBeNull();

        vote.getUser()
        .then( ( user ) => {
          expect( user.id ).toBe( this.user.id );
          expect( user.email ).toBe( this.user.email ); // "starman"
          done();
        } );
      } );
    } );

  } );
  /* END ----- Vote.getUser() ----- */

} );
/* END ----- Vote ----- */
