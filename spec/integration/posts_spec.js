const request = require( "request" );
const server = require( "../../src/server.js" );
const mockAuth = require( "../support/mock-auth.js" );

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
    }, {
      title: "Outdoor Escape!",
      body: "Anybody want to do the maze at The Overlook Hotel?"
    } ],
    users: [ {
      email: "starman@tesla.com",
      password: "Trekkie4lyfe",
      role: "admin"
    }, {
      email: "admin@example.com",
      password: "123456",
      role: "admin"
    }, {
      email: "member@example.com",
      password: "123456",
      role: "member"
    } ]
  };
  /* END ----- seeds ----- */

  beforeAll( ( done ) => {
    mockAuth.mockSignOut( done );
  } );

  beforeEach( ( done ) => {

    this.topic;
    this.post = { member: null, owner: null };
    this.user;

    sequelize.sync( { force: true } ).then( ( res ) => {

      const values = seeds.users[ 0 ]; // email: "starman@tesla.com"

      User.create( values )
      .then( ( user ) => {
        expect( user ).not.toBeNull();

        const values = { ...seeds.topics[ 0 ] }; // "Winter Games"
        values.posts = [ { ...seeds.posts[ 3 ] } ]; // "Outdoor Escape!"
        values.posts[ 0 ].userId = user.id;

        Topic.create( values, { include: { model: Post, as: "posts" } } )
        .then( ( topic ) => {
          expect( topic ).not.toBeNull();
          this.topic = topic;
          this.post.member = topic.posts[ 0 ];
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

  afterEach( ( done ) => {
    mockAuth.mockSignOut( done );
  } );


  describe( "admin user CRUD operations", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 1 ]; // email: "admin@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "admin" ); // admin user
        this.user = user;

        const values = { ...seeds.posts[ 0 ] }; // "Snowball Fighting"
        values.topicId = this.topic.id;
        values.userId = user.id;

        Post.create( values )
        .then( ( post ) => {
          expect( post ).not.toBeNull();
          this.post.owner = post;

          const data = { userId: user.id, email: user.email, role: user.role };
          mockAuth.mockSignIn( data, ( err, res, body ) => {
            expect( err ).toBeNull();
            done();
          } );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
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


    describe( "POST /topics/:topicId/posts/create", () => {

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
          expect( res.statusCode ).toBe( 302 );

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

      it( "should render a view with the requested post", ( done ) => {

        const post = this.post.member; // "Outdoor Escape!"
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `<h1>${ post.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:topicId/posts/:id ----- */


    describe( "POST /topics/:topicId/posts/:id/destroy", () => {

      it( "should delete a post owned by the user", ( done ) => {

        const post = this.post.owner;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/destroy`;

        expect( post.userId ).toBe( this.user.id );

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

      it( "should delete a post owned by another user", ( done ) => {

        const post = this.post.member;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/destroy`;

        expect( post.userId ).not.toBe( this.user.id );

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

      it( "should render a form to edit a post " +
          "owned by the user", ( done ) => {

        const post = this.post.owner;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/edit`;

        expect( post.userId ).toBe( this.user.id );

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "<h1>Edit Post</h1>" );
          expect( body ).toContain( post.title ); // "Snowball Fighting"
          done();
        } );
      } );

      it( "should render a form to edit a post " +
          "owned by another user", ( done ) => {

        const post = this.post.member;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/edit`;

        expect( post.userId ).not.toBe( this.user.id );

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

      it( "should update a post owned by the user", ( done ) => {

        const post = this.post.owner;
        const postId = post.id;
        const before = { ...post.get() };

        expect( post.userId ).toBe( this.user.id );

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

      it( "should update a post owned by another user", ( done ) => {

        const post = this.post.member;
        const postId = post.id;
        const before = { ...post.get() };

        expect( post.userId ).not.toBe( this.user.id );

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
  /* END ----- admin user CRUD operations ----- */


  describe( "member user CRUD operations", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 2 ]; // email: "member@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "member" ); // member user
        this.user = user;

        const values = { ...seeds.posts[ 0 ] }; // "Snowball Fighting"
        values.topicId = this.topic.id;
        values.userId = user.id;

        Post.create( values )
        .then( ( post ) => {
          expect( post ).not.toBeNull();
          this.post.owner = post;

          const data = { userId: user.id, email: user.email, role: user.role };
          mockAuth.mockSignIn( data, ( err, res, body ) => {
            expect( err ).toBeNull();
            done();
          } );
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
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


    describe( "POST /topics/:topicId/posts/create", () => {

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

    } );
    /* END ----- POST /topics/:topicId/posts/create ----- */


    describe( "GET /topics/:topicId/posts/:id", () => {

      it( "should render a view with the requested post", ( done ) => {

        const post = this.post.member; // "Outdoor Escape!"
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `<h1>${ post.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:topicId/posts/:id ----- */


    describe( "POST /topics/:topicId/posts/:id/destroy", () => {

      it( "should delete a post owned by the user", ( done ) => {

        const post = this.post.owner;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/destroy`;

        expect( post.userId ).toBe( this.user.id );

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

      it( "should NOT delete a post owned by another user", ( done ) => {

        const post = this.post.member; // FORBIDDEN!
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/destroy`;

        expect( post.userId ).not.toBe( this.user.id );

        request.post( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Post.findByPk( postId )
          .then( ( post ) => {
            expect( post ).not.toBeNull();
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:topicId/posts/:id/destroy ----- */


    describe( "GET /topics/:topicId/posts/:id/edit", () => {

      it( "should render a form to edit a post " +
          "owned by the user", ( done ) => {

        const post = this.post.owner;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/edit`;

        expect( post.userId ).toBe( this.user.id );

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "<h1>Edit Post</h1>" );
          expect( body ).toContain( post.title ); // "Snowball Fighting"
          done();
        } );
      } );

      it( "should NOT render a form to edit a post owned by another user " +
          "AND redirect to '/posts/:id'", ( done ) => {

        const post = this.post.member; // FORBIDDEN!
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/edit`;

        expect( post.userId ).not.toBe( this.user.id );

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          //expect( res.statusCode ).toBe( 302 );
          expect( body ).not.toContain( "<h1>Edit Post</h1>" );
          expect( body ).toContain( `<h1>${ post.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:topicId/posts/:id/edit ----- */


    describe( "POST /topics/:topicId/posts/:id/update", () => {

      it( "should update a post owned by the user", ( done ) => {

        const post = this.post.owner;
        const postId = post.id;
        const before = { ...post.get() };

        expect( post.userId ).toBe( this.user.id );

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

      it( "should NOT update a post owned by another user", ( done ) => {

        const post = this.post.member; // FORBIDDEN!
        const postId = post.id;
        const before = { ...post.get() };

        expect( post.userId ).not.toBe( this.user.id );

        const url = `${ base }/${ post.topicId }/posts/${ postId }/update`;
        const values = seeds.posts[ 2 ]; // "Snowman Building Competition"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Post.findOne( { where: { id: postId } } )
          .then( ( post ) => {
            expect( post.id ).toBe( before.id ); // unchanged
            expect( post.title ).toBe( before.title ); // unchanged
            expect( post.title ).not.toBe( values.title );
            expect( post.body ).toBe( before.body );  // unchanged
            expect( post.body ).not.toBe( values.body );
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:topicId/posts/:id/update ----- */

  } );
  /* END ----- member user CRUD operations ----- */


  describe( "guest user CRUD operations", () => {

    describe( "GET /topics/:topicId/posts/new", () => {

      it( "should redirect to the '/users/sign_in' view", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/new`; // FORBIDDEN!

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          //expect( res.statusCode ).toBe( 302 );
          expect( body ).not.toContain( "<h1>New Post</h1>" );
          expect( body ).toContain( "<h1>Sign in</h1>" );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:topicId/posts/new ----- */


    describe( "POST /topics/:topicId/posts/create", () => {

      it( "should NOT create a new post", ( done ) => {

        const url = `${ base }/${ this.topic.id }/posts/create`; // FORBIDDEN!
        const values = seeds.posts[ 1 ]; // "Watching snow melt"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

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

      it( "should render a view with the requested post", ( done ) => {

        const post = this.post.member; // "Outdoor Escape!"
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `<h1>${ post.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:topicId/posts/:id ----- */


    describe( "POST /topics/:topicId/posts/:id/destroy", () => {

      it( "should NOT delete the specified post", ( done ) => {

        const post = this.post.member;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/destroy`;

        request.post( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Post.findByPk( postId )
          .then( ( post ) => {
            expect( post ).not.toBeNull();
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:topicId/posts/:id/destroy ----- */


    describe( "GET /topics/:topicId/posts/:id/edit", () => {

      it( "should NOT render a form to edit the specified post " +
          "AND redirect to the '/users/sign_in' view", ( done ) => {

        const post = this.post.member;
        const postId = post.id;
        const url = `${ base }/${ post.topicId }/posts/${ postId }/edit`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          //expect( res.statusCode ).toBe( 302 );
          expect( body ).not.toContain( "<h1>Edit Post</h1>" );
          expect( body ).toContain( "<h1>Sign in</h1>" );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:topicId/posts/:id/edit ----- */


    describe( "POST /topics/:topicId/posts/:id/update", () => {

      it( "should NOT update the specified post", ( done ) => {

        const post = this.post.member;
        const postId = post.id;
        const before = { ...post.get() };

        const url = `${ base }/${ post.topicId }/posts/${ postId }/update`;
        const values = seeds.posts[ 2 ]; // "Snowman Building Competition"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Post.findOne( { where: { id: postId } } )
          .then( ( post ) => {
            expect( post.id ).toBe( before.id ); // unchanged
            expect( post.title ).toBe( before.title ); // unchanged
            expect( post.title ).not.toBe( values.title );
            expect( post.body ).toBe( before.body );  // unchanged
            expect( post.body ).not.toBe( values.body );
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:topicId/posts/:id/update ----- */

  } );
  /* END ----- guest user CRUD operations ----- */

} );
/* END ----- routes : posts ----- */
