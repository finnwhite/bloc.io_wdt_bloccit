const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;


describe( "Post", () => {

  const seeds = {
    topics: [
      {
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      },
      {
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      }
    ],
    posts: [
      {
        title: "My first visit to Proxima Centauri b",
        body: "I saw some rocks."
      },
      {
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question."
      }
    ]
  };

  beforeEach( ( done ) => {

    this.topic;
    this.post;

    const data = {
      topic: seeds.topics[0], // "Expeditions to Alpha Centauri"
      post: seeds.posts[0] // "My first visit to Proxima Centauri b"
    };

    sequelize.sync( { force: true } ).then( ( res ) => {

      Topic.create( {
        title: data.topic.title,
        description: data.topic.description
      } )
      .then( ( topic ) => {
        this.topic = topic;

        Post.create( {
          title: data.post.title,
          body: data.post.body,
          topicId: this.topic.id
        } )
        .then( ( post ) => {
          this.post = post;
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

    const data = seeds.posts[1]; // "Pros of Cryosleep during the long journey"

    it( "should create a post object with " +
        "a title, body, and assigned topic", ( done ) => {

      Post.create( {
        title: data.title,
        body: data.body,
        topicId: this.topic.id
      } )
      .then( ( post ) => {
        expect( post.title ).toBe( data.title );
        expect( post.body ).toBe( data.body );
        expect( post.topicId ).toBe( this.topic.id );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

    it( "should NOT create a post with " +
        "missing title, body, or assigned topic", ( done ) => {

      Post.create( {
        title: data.title
      } )
      .then( ( post ) => { // should never succeed, execute
        done();
      } )
      .catch( ( err ) => {
        expect( err.message ).toContain( "notNull Violation" );
        expect( err.message ).toContain( "Post.body cannot be null" );
        expect( err.message ).toContain( "Post.topicId cannot be null" );
        done();
      } );
    } );

  } );
  /* END ----- Post.create() ----- */


  describe( ".setTopic()", () => {

    it( "should associate a topic and a post together", ( done ) => {

      const data = seeds.topics[1]; // "Challenges of interstellar travel"

      Topic.create( {
        title: data.title,
        description: data.description
      } )
      .then( ( newTopic ) => {

        const oldTopic = this.topic;
        expect( this.post.topicId ).toBe( oldTopic.id );

        this.post.setTopic( newTopic )
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
        expect( topic.title ).toBe( this.topic.title ); // "Expeditions..."
        done();
      } );
    } );

  } );
  /* END ----- Post.getTopic() ----- */

} );
/* END ----- Post ----- */
