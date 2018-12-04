const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const User = require( "../../src/db/models" ).User;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const Comment = require( "../../src/db/models" ).Comment;


describe( "Comment", () => {

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
    this.comment;

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

          const values = { ...seeds.comments[ 0 ] }; // "ay caramba!!!!!"
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
  } );
  /* END ----- beforeEach() ----- */


  describe( ".create()", () => {

    it( "should create a comment with specified " +
        "body, and associated post and user", ( done ) => {

      const values = { ...seeds.comments[ 1 ] }; // "The geological kind."
      values.postId = this.post.id;
      values.userId = this.user.id;

      Comment.create( values )
      .then( ( comment ) => {
        expect( comment.body ).toBe( values.body );
        expect( comment.postId ).toBe( values.postId );
        expect( comment.userId ).toBe( values.userId );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create a comment with missing " +
        "body, or associated post and user", ( done ) => {

      Comment.create( { body: seeds.comments[ 2 ].body } ) // "...dampers...?"
      .then( ( comment ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "Comment.postId cannot be null" );
        expect( err.message ).toContain( "Comment.userId cannot be null" );
        done();
      } );
    } );

  } );
  /* END ----- Comment.create() ----- */


  describe( ".setPost()", () => {

    it( "should associate comment with specified post", ( done ) => {

      const comment = this.comment;
      const oldPost = this.post;
      expect( comment.postId ).toBe( oldPost.id );

      const values = { ...seeds.posts[ 1 ] }; // "Dress code on Proxima b"
      values.topicId = this.topic.id;
      values.userId = this.user.id;

      Post.create( values )
      .then( ( newPost ) => {

        comment.setPost( newPost )
        .then( ( comment ) => {
          expect( comment.postId ).not.toBe( oldPost.id );
          expect( comment.postId ).toBe( newPost.id );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Comment.setPost() ----- */

  describe( ".getPost()", () => {

    it( "should return the associated post", ( done ) => {

      this.comment.getPost()
      .then( ( post ) => {
        expect( post.id ).toBe( this.post.id );
        expect( post.title ).toBe( this.post.title ); // "My first visit..."
        done();
      } );
    } );

  } );
  /* END ----- Comment.getPost() ----- */


  describe( ".setUser()", () => {

    it( "should associate comment with specified user", ( done ) => {

      const comment = this.comment;
      const oldUser = this.user;
      expect( comment.userId ).toBe( oldUser.id );

      const values = seeds.users[ 1 ]; // email: "bob@example.com"

      User.create( values )
      .then( ( newUser ) => {

        comment.setUser( newUser )
        .then( ( comment ) => {
          expect( comment.userId ).not.toBe( oldUser.id );
          expect( comment.userId ).toBe( newUser.id );
          done();
        } );
      } );
    } );

  } );
  /* END ----- Comment.setUser() ----- */

  describe( ".getUser()", () => {

    it( "should return the associated user", ( done ) => {

      this.comment.getUser()
      .then( ( user ) => {
        expect( user.id ).toBe( this.user.id );
        expect( user.email ).toBe( this.user.email ); // "starman@tesla.com"
        done();
      } );
    } );

  } );
  /* END ----- Comment.getUser() ----- */

} );
/* END ----- Comment ----- */
