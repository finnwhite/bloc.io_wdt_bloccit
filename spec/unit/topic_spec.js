const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;


describe( "Topic", () => {

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

    const data = seeds.topics[0]; // "Expeditions to Alpha Centauri"

    sequelize.sync( { force: true } ).then( ( res ) => {
      Topic.create( {
        title: data.title,
        description: data.description
      } )
      .then( ( topic ) => {
        this.topic = topic;
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
  } );


  describe( ".create()", () => {

    const data = seeds.topics[1]; // "Challenges of interstellar travel"

    it( "should create Topic instance with specified values", ( done ) => {

      Topic.create( {
        title: data.title,
        description: data.description,
      } )
      .then( ( topic ) => {
        expect( topic.title ).toBe( data.title );
        expect( topic.description ).toBe( data.description );
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

    it( "should return an array of Post instances " +
        "associated with Topic", ( done ) => {

      const topic = this.topic;
      const topicId = topic.id;

      /* duplicate all seed posts, adding this.topic.id */
      const data = seeds.posts.map( ( props ) => {
        let post = { ...props };
        post.topicId = topicId;
        return post;
      } );

      topic.getPosts()
      .then( ( postsBefore ) => {
        expect( postsBefore.length ).toBe( 0 );

        Post.bulkCreate( data )
        .then( ( newPosts ) => {
          expect( newPosts.length ).toBe( data.length );

          topic.getPosts()
          .then( ( postsAfter ) => {
            expect( postsAfter.length ).not.toBe( postsBefore.length );
            expect( postsAfter.length ).toBe( newPosts.length );

            expect( postsAfter[0].title ).toBe( data[0].title );
            expect( postsAfter[0].body ).toBe( data[0].body );
            expect( postsAfter[0].topicId ).toBe( data[0].topicId );
            expect( postsAfter[0].topicId ).toBe( topicId );
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
