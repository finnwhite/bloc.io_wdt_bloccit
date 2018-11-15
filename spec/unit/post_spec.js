const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;


describe( "Post", () => {

  beforeEach( ( done ) => {

    this.topic;
    this.post;

    sequelize.sync( { force: true } ).then( ( res ) => {
      Topic.create( {
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      } )
      .then( ( topic ) => {
        this.topic = topic;
        Post.create( {
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
          topicId: this.topic.id
        } )
        .then( ( post ) => {
          this.post = post;
          done();
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
  } );


  describe( ".create()", () => {

    it( "should create a post object with " +
        "a title, body, and assigned topic", ( done ) => {

      const data = {
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question.",
      };

      Post.create( {
        title: data.title,
        body: data.body,
        topicId: this.topic.id
      } )
      .then( ( post ) => {
        expect( post.title ).toBe( data.title );
        expect( post.body ).toBe( data.body );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Post.create() ----- */

} );
/* END ----- Post ----- */
