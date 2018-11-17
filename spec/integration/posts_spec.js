const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/topics";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;


describe( "routes : posts", () => {

  const seeds = {
    topics: [
      {
        title: "Winter Games",
        description: "Post your Winter Games stories."
      }
    ],
    posts: [
      {
        title: "Snowball Fighting",
        body: "So much snow!"
      },
      {
        title: "Watching snow melt",
        body: "Without a doubt my favoriting things to do besides watching paint dry!"
      },
      {
        title: "Snowman Building Competition",
        body: "I love watching them melt slowly."
      }
    ]
  };

  beforeEach( ( done ) => {

    this.topic;
    this.post;

    const data = {
      topic: seeds.topics[0], // "Winter Games"
      post: seeds.posts[0] // "Snowball Fighting"
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


  describe( "GET /topics/:topicId/posts/new", () => {

    it( "should render a new post form", ( done ) => {
      const url = `${ base }/${ this.topic.id }/posts/new`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "New Post" );
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:topicId/posts/new ----- */


  describe( "POST /topics/:topicId/posts/create", () => {

    it( "should create a new post and redirect", ( done ) => {

      const options = {
        url: `${ base }/${ this.topic.id }/posts/create`,
        form: seeds.posts[1] // "Watching snow melt"
      };

      request.post( options, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 303 );

        Post.findOne( { where: { title: options.form.title } } )
        .then( ( post ) => {
          expect( post ).not.toBeNull();
          expect( post.title ).toBe( options.form.title );
          expect( post.body ).toBe( options.form.body );
          expect( post.topicId ).not.toBeNull();
          expect( post.topicId ).toBe( this.topic.id );
          done();
        } )
        .catch( ( err ) => {
          console.log( err );
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /topics/:topicId/posts/create ----- */


  describe( "GET /topics/:topicId/posts/:id", () => {

    it( "should render a view with the selected post", ( done ) => {
      const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( this.post.title ); // "Snowball Fighting"
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:topicId/posts/:id ----- */


  describe( "POST /topics/:topicId/posts/:id/destroy", () => {

    it( "should delete the post with the associated ID", ( done ) => {
      const postId = this.post.id;
      const url = `${ base }/${ this.topic.id }/posts/${ postId }/destroy`;
      request.post( url, ( err, res, body ) => {
        expect( err ).toBeNull();

        Post.findByPk( postId )
        .then( ( post ) => {
          expect( post ).toBeNull();
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /topics/:topicId/posts/:id/destroy ----- */


  describe( "GET /topics/:topicId/posts/:id/edit", () => {

    it( "should render a view with an edit post form", ( done ) => {
      const url = `${ base }/${ this.topic.id }/posts/${ this.post.id }/edit`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "Edit Post" );
        expect( body ).toContain( this.post.title ); // "Snowball Fighting"
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:topicId/posts/:id/edit ----- */


  describe( "POST /topics/:topicId/posts/:id/update", () => {

    it( "should update the post with the given values AND " +
        "return a status code 303", ( done ) => {

      const postId = this.post.id;
      const options = {
        url: `${ base }/${ this.topic.id }/posts/${ postId }/update`,
        form: seeds.posts[2] // "Snowman Building Competition"
      };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

        Post.findOne( { where: { id: postId } } )
        .then( ( post ) => {
          expect( post.title ).toBe( options.form.title ); // "Snowman..."
          expect( post.body ).toBe( options.form.body ); // "I love..."
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /topics/:topicId/posts/:id/update ----- */

} );
/* END ----- routes : posts ----- */
