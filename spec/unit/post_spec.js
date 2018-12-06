const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Vote = require( "../../src/db/models" ).Vote;


describe( "Post", () => {

  const UPVOTE = 1;
  const DOWNVOTE = -1;

  const seeds = {
    topics: [ {
      title: "Expeditions to Alpha Centauri",
      description: "A compilation of reports from recent visits to the star system."
    }, {
      title: "Challenges of interstellar travel",
      description: "1. The Wi-Fi is terrible"
    } ],
    posts: [ {
      title: "My first visit to Proxima Centauri b",
      body: "I saw some rocks."
    }, {
      title: "Pros of Cryosleep during the long journey",
      body: "1. Not having to answer the 'are we there yet?' question."
    } ],
    users: [ {
      email: "starman@tesla.com",
      password: "Trekkie4lyfe"
    }, {
      email: "ada@example.com",
      password: "password"
    } ]
  };
  /* END ----- seeds ----- */

  beforeEach( ( done ) => {
    this.user;
    this.topic;
    this.post;

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


  describe( ".create()", () => {

    it( "should create a post with specified " +
        "title, body, and associated topic and user", ( done ) => {

      const values = { ...seeds.posts[ 1 ] }; // "Pros of Cryosleep..."
      values.topicId = this.topic.id;
      values.userId = this.user.id;

      Post.create( values )
      .then( ( post ) => {
        expect( post.title ).toBe( values.title );
        expect( post.body ).toBe( values.body );
        expect( post.topicId ).toBe( values.topicId );
        expect( post.userId ).toBe( values.userId );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create a post with missing " +
        "title, body, or associated topic and user", ( done ) => {

      Post.create( { title: seeds.posts[ 1 ].title } )
      .then( ( post ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "Post.body cannot be null" );
        expect( err.message ).toContain( "Post.topicId cannot be null" );
        expect( err.message ).toContain( "Post.userId cannot be null" );
        done();
      } );
    } );

  } );
  /* END ----- Post.create() ----- */


  describe( ".setTopic()", () => {

    it( "should associate post with specified topic", ( done ) => {

      const post = this.post;
      const oldTopic = this.topic;
      expect( post.topicId ).toBe( oldTopic.id );

      const values = seeds.topics[ 1 ]; // "Challenges of interstellar travel"

      Topic.create( values )
      .then( ( newTopic ) => {

        post.setTopic( newTopic )
        .then( ( post ) => {
          expect( post.topicId ).not.toBe( oldTopic.id );
          expect( post.topicId ).toBe( newTopic.id );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Post.setTopic() ----- */

  describe( ".getTopic()", () => {

    it( "should return the associated topic", ( done ) => {

      this.post.getTopic()
      .then( ( topic ) => {
        expect( topic.id ).toBe( this.topic.id );
        expect( topic.title ).toBe( this.topic.title ); // "Expeditions..."
        done();
      } );
    } );

  } );
  /* END ----- Post.getTopic() ----- */


  describe( ".setUser()", () => {

    it( "should associate post with specified user", ( done ) => {

      const post = this.post;
      const oldUser = this.user;
      expect( post.userId ).toBe( oldUser.id );

      const values = seeds.users[ 1 ]; // email: "ada@example.com"

      User.create( values )
      .then( ( newUser ) => {

        post.setUser( newUser )
        .then( ( post ) => {
          expect( post.userId ).not.toBe( oldUser.id );
          expect( post.userId ).toBe( newUser.id );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Post.setUser() ----- */

  describe( ".getUser()", () => {

    it( "should return the associated user", ( done ) => {

      this.post.getUser()
      .then( ( user ) => {
        expect( user.id ).toBe( this.user.id );
        expect( user.email ).toBe( this.user.email ); // "starman@tesla.com"
        done();
      } );
    } );

  } );
  /* END ----- Post.getUser() ----- */


  describe( ".getPoints()", () => {

    it( "should return the sum of associated vote values", ( done ) => {

      const options = { include: [ { model: Vote, as: "votes" } ] };

      Post.findByPk( this.post.id, options )
      .then( ( post ) => {
        const points = post.getPoints();
        expect( points ).toBeGreaterThanOrEqual( 0 );

        const values = {
          value: UPVOTE,
          postId: post.id,
          userId: this.user.id, // email: "starman@tesla.com"
        };

        Vote.create( values )
        .then( ( vote ) => {
          expect( vote.value ).toBe( UPVOTE );

          post.reload( options )
          .then( ( post ) => {
            expect( post.getPoints() ).toBe( points + UPVOTE ); // +1

            vote.value = DOWNVOTE;
            vote.save()
            .then( ( vote ) => {
              expect( vote.value ).toBe( DOWNVOTE );

              post.reload( options )
              .then( ( post ) => {
                expect( post.getPoints() ).toBe( points + DOWNVOTE ); // -1
                done();
              } );
            } );
          } );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Post.getPoints() ----- */


  describe( ".hasUpvoteFor()", () => {

    it( "should return TRUE if specified user " +
        "has cast an upvote for the post", ( done ) => {

      const options = { include: [ { model: Vote, as: "votes" } ] };

      Post.findByPk( this.post.id, options )
      .then( ( post ) => {

        const values = seeds.users[ 1 ]; // email: "ada@example.com"

        User.create( values )
        .then( ( user ) => {
          expect( post.hasUpvoteFor( user.id ) ).toBeFalsy();

          const values = { value: UPVOTE, postId: post.id, userId: user.id, };

          Vote.create( values )
          .then( ( vote ) => {
            expect( vote.value ).toBe( UPVOTE );

            post.reload( options )
            .then( ( post ) => {
              expect( post.hasUpvoteFor( user.id ) ).toBeTruthy();
              done();
            } );
          } );
        } );
      } )
    } );

  } );
  /* END ----- Post.hasUpvoteFor() ----- */

  describe( ".hasDownvoteFor()", () => {

    it( "should return TRUE if specified user " +
        "has cast a downvote for the post", ( done ) => {

      const options = { include: [ { model: Vote, as: "votes" } ] };

      Post.findByPk( this.post.id, options )
      .then( ( post ) => {

        const values = seeds.users[ 1 ]; // email: "ada@example.com"

        User.create( values )
        .then( ( user ) => {
          expect( post.hasDownvoteFor( user.id ) ).toBeFalsy();

          const values = { value: DOWNVOTE, postId: post.id, userId: user.id, };

          Vote.create( values )
          .then( ( vote ) => {
            expect( vote.value ).toBe( DOWNVOTE );

            post.reload( options )
            .then( ( post ) => {
              expect( post.hasDownvoteFor( user.id ) ).toBeTruthy();
              done();
            } );
          } );
        } );
      } )
    } );

  } );
  /* END ----- Post.hasDownvoteFor() ----- */

} );
/* END ----- Post ----- */
