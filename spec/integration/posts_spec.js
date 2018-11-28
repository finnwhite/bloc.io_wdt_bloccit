const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/topics";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const User = require( "../../src/db/models" ).User;


describe( "routes : posts", () => {

  const seeds = {
    topics: [ {
      title: "Winter Games",
      description: "Post your Winter Games stories."
    } ],
    posts: [ {
      title: "Snowball Fighting",
      body: "So much snow!"
    }, {
      title: "Watching snow melt",
      body: "Without a doubt my favoriting things to do besides watching paint dry!"
    }, {
      title: "Snowman Building Competition",
      body: "I love watching them melt slowly."
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

        const values = { ...seeds.topics[ 0 ] }; // "Winter Games"
        values.posts = [ { ...seeds.posts[ 0 ] } ]; // "Snowball Fighting"
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


  describe( "GET /topics/:topicId/posts/new", () => {

    it( "should render a new post form", ( done ) => {

      const url = `${ base }/${ this.topic.id }/posts/new`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>New Post</h1>" );
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:topicId/posts/new ----- */


  xdescribe( "POST /topics/:topicId/posts/create", () => {

    it( "should create a new post AND redirect", ( done ) => {

      const url = `${ base }/${ this.topic.id }/posts/create`;
      const values = seeds.posts[ 1 ]; // "Watching snow melt"
      const options = { url: url, form: values };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

        Post.findOne( { where: { title: values.title } } )
        .then( ( post ) => {
          expect( post ).not.toBeNull();
          expect( post.title ).toBe( values.title );
          expect( post.body ).toBe( values.body );
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

    it( "should NOT create a new post that fails validations", ( done ) => {

      const url = `${ base }/${ this.topic.id }/posts/create`;
      const values = { title: "A", body: "B" } // INVALID!
      const options = { url: url, form: values };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

        Post.findOne( { where: { title: values.title } } )
        .then( ( post ) => {
          expect( post ).toBeNull();
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

      const post = this.post;
      const postId = post.id;
      const url = `${ base }/${ post.topicId }/posts/${ postId }`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( post.title ); // "Snowball Fighting"
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:topicId/posts/:id ----- */


  describe( "POST /topics/:topicId/posts/:id/destroy", () => {

    it( "should delete the post with the associated ID", ( done ) => {

      const post = this.post;
      const postId = post.id;
      const url = `${ base }/${ post.topicId }/posts/${ postId }/destroy`;

      request.post( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

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

      const post = this.post;
      const postId = post.id;
      const url = `${ base }/${ post.topicId }/posts/${ postId }/edit`;

      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 200 );
        expect( body ).toContain( "<h1>Edit Post</h1>" );
        expect( body ).toContain( post.title ); // "Snowball Fighting"
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:topicId/posts/:id/edit ----- */


  describe( "POST /topics/:topicId/posts/:id/update", () => {

    it( "should update the post with the given values " +
        "AND return a status code 303", ( done ) => {

      const post = this.post;
      const postId = post.id;
      const before = { ...post.get() };

      const url = `${ base }/${ post.topicId }/posts/${ postId }/update`;
      const values = seeds.posts[ 2 ]; // "Snowman Building Competition"
      const options = { url: url, form: values };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( res.statusCode ).toBe( 303 );

        Post.findOne( { where: { id: postId } } )
        .then( ( post ) => {
          expect( post.id ).toBe( before.id ); // unchanged
          expect( post.title ).not.toBe( before.title );
          expect( post.title ).toBe( values.title ); // updated
          expect( post.body ).not.toBe( before.body );
          expect( post.body ).toBe( values.body ); // updated
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /topics/:topicId/posts/:id/update ----- */

} );
/* END ----- routes : posts ----- */
