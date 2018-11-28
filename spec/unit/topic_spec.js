const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const User = require( "../../src/db/models" ).User;


describe( "Topic", () => {

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
    } ]
  };
  /* END ----- seeds ----- */

  beforeEach( ( done ) => {

    this.topic;
    this.post;
    this.user;

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

    it( "should create a topic with specified values", ( done ) => {

      const values = seeds.topics[ 1 ]; // "Challenges of interstellar travel"

      Topic.create( values )
      .then( ( topic ) => {
        expect( topic.title ).toBe( values.title );
        expect( topic.description ).toBe( values.description );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Topic.create() ----- */


  describe( ".getPosts()", () => {

    it( "should return an array of posts " +
        "associated with specified topic", ( done ) => {

      const topic = this.topic;

      topic.getPosts()
      .then( ( posts ) => {
        const countBefore = posts.length;
        expect( countBefore ).toBeGreaterThan( 0 );

        const values = { ...seeds.posts[ 1 ] }; // "Pros of Cryosleep..."
        values.topicId = topic.id;
        values.userId = this.user.id;

        Post.create( values )
        .then( ( post ) => {
          expect( post.title ).toBe( values.title );
          expect( post.body ).toBe( values.body );
          expect( post.topicId ).toBe( values.topicId );
          expect( post.userId ).toBe( values.userId );

          topic.getPosts()
          .then( ( posts ) => {
            expect( posts.length ).toBe( countBefore + 1 );
            done();
          } );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );
  /* END ----- Topic.getPosts() ----- */

} );
/* END ----- Topic ----- */
