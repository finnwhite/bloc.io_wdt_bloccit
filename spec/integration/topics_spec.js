const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/topics";
const mockAuthUrl = "http://localhost:3000/auth/mock"

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const User = require( "../../src/db/models" ).User;


describe( "routes : topics", () => {

  const seeds = {
    topics: [ {
      title: "JS Frameworks",
      description: "There is a lot of them."
    }, {
      title: "blink-182 songs",
      description: "What's your favorite blink-182 song?"
    } ],
    users: [ {
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

  beforeEach( ( done ) => {

    this.topic;

    sequelize.sync( { force: true } ).then( ( res ) => {

      const values = seeds.topics[ 0 ]; // "JS Frameworks"

      Topic.create( values )
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
  /* END ----- beforeEach() ----- */


  describe( "admin user CRUD operations", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 0 ]; // email: "admin@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "admin" ); // admin user

        const url = mockAuthUrl;
        const data = { role: user.role, userId: user.id, email: user.email };
        const options = { url: url, form: data };

        request.get( options, ( err, res, body ) => { // mock authenticate
          expect( err ).toBeNull();
          done();
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
    /* END ----- beforeEach() ----- */


    describe( "GET /topics", () => {

      it( "should return status code 200 AND list all topics", ( done ) => {

        const url = base;
        const topics = seeds.topics;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "<h1>Topics</h1>" );
          expect( body ).toContain( "</ul>" );
          expect( body ).toContain( topics[ 0 ].title ); // "JS Frameworks"
          done();
        } );
      } );

    } );
    /* END ----- GET /topics ----- */


    describe( "GET /topics/new", () => {

      it( "should render a new topic form", ( done ) => {

        const url = `${ base }/new`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "<h1>New Topic</h1>" );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/new ----- */


    describe( "POST /topics/create", () => {

      it( "should create a new topic AND redirect", ( done ) => {

        const url = `${ base }/create`;
        const values = seeds.topics[ 1 ]; // "blink-182 songs"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 303 );

          Topic.findOne( { where: { title: values.title } } )
          .then( ( topic ) => {
            expect( topic ).not.toBeNull();
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

      it( "should NOT create a new topic that fails validations", ( done ) => {

        const url = `${ base }/create`;
        const values = { title: "test", description: "testing" } // INVALID!
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Topic.findOne( { where: { title: values.title } } )
          .then( ( topic ) => {
            expect( topic ).toBeNull();
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/create ----- */


    describe( "GET /topics/:id", () => {

      it( "should render a view with the selected topic", ( done ) => {

        const topic = this.topic; // "JS Frameworks"
        const url = `${ base }/${ topic.id }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `<h1>${ topic.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:id ----- */


    describe( "POST /topics/:id/destroy", () => {

      it( "should delete the topic with the associated ID", ( done ) => {

        Topic.findAll()
        .then( ( topics ) => {
          const countBefore = topics.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const url = `${ base }/${ this.topic.id }/destroy`;

          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 303 );

            Topic.findAll()
            .then( ( topics ) => {
              expect( topics.length ).toBe( countBefore - 1 );
              done();
            } );
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:id/destroy ----- */


    describe( "GET /topics/:id/edit", () => {

      it( "should render a view with an edit topic form", ( done ) => {

        const topic = this.topic; // "JS Frameworks"
        const url = `${ base }/${ topic.id }/edit`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "<h1>Edit Topic</h1>" );
          expect( body ).toContain( topic.title );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:id/edit ----- */


    describe( "POST /topics/:id/update", () => {

      it( "should update the topic with the given values", ( done ) => {

        const topic = this.topic; // "JS Frameworks"
        const topicId = topic.id;
        const before = { ...topic.get() };

        const url = `${ base }/${ topicId }/update`;
        const values = {
          title: "JavaScript Frameworks",
          description: "There are a lot of them."
        }
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 303 );

          Topic.findOne( { where: { id: topicId } } )
          .then( ( topic ) => {
            expect( topic.id ).toBe( before.id ); // unchanged
            expect( topic.title ).not.toBe( before.title );
            expect( topic.title ).toBe( values.title ); // updated
            expect( topic.description ).not.toBe( before.description );
            expect( topic.description ).toBe( values.description ); // updated
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:id/update ----- */

  } );
  /* END ----- admin user CRUD operations ----- */


  describe( "member user CRUD operations", () => {

    beforeEach( ( done ) => {

      const values = seeds.users[ 1 ]; // email: "member@example.com"

      User.findOrCreate( { where: values } )
      .spread( ( user, created ) => {
        expect( user ).not.toBeNull();
        expect( user.role ).toBe( "member" ); // member user

        const url = mockAuthUrl;
        const data = { role: user.role, userId: user.id, email: user.email };
        const options = { url: url, form: data };

        request.get( options, ( err, res, body ) => { // mock authenticate
          expect( err ).toBeNull();
          done();
        } );
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );
    /* END ----- beforeEach() ----- */


    describe( "GET /topics", () => {

      it( "should return status code 200 AND list all topics", ( done ) => {

        const url = base;
        const topics = seeds.topics;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( "<h1>Topics</h1>" );
          expect( body ).toContain( "</ul>" );
          expect( body ).toContain( topics[ 0 ].title ); // "JS Frameworks"
          done();
        } );
      } );

    } );
    /* END ----- GET /topics ----- */


    describe( "GET /topics/new", () => {

      it( "should redirect to '/topics' view", ( done ) => {

        const url = `${ base }/new`; // FORBIDDEN!

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          //expect( res.statusCode ).toBe( 302 );
          expect( body ).not.toContain( "<h1>New Topic</h1>" );
          expect( body ).toContain( "<h1>Topics</h1>" );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/new ----- */


    describe( "POST /topics/create", () => {

      it( "should NOT create a new topic", ( done ) => {

        const url = `${ base }/create`; // FORBIDDEN!
        const values = seeds.topics[ 1 ]; // "blink-182 songs"
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Topic.findOne( { where: { title: values.title } } )
          .then( ( topic ) => {
            expect( topic ).toBeNull();
            done();
          } )
          .catch( ( err ) => {
            console.log( err );
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/create ----- */


    describe( "GET /topics/:id", () => {

      it( "should render a view with the selected topic", ( done ) => {

        const topic = this.topic; // "JS Frameworks"
        const url = `${ base }/${ topic.id }`;

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 200 );
          expect( body ).toContain( `<h1>${ topic.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:id ----- */


    describe( "POST /topics/:id/destroy", () => {

      it( "should NOT delete the topic with the associated ID", ( done ) => {

        Topic.findAll()
        .then( ( topics ) => {
          const countBefore = topics.length;
          expect( countBefore ).toBeGreaterThan( 0 );

          const url = `${ base }/${ this.topic.id }/destroy`; // FORBIDDEN!

          request.post( url, ( err, res, body ) => {
            expect( err ).toBeNull();
            expect( res.statusCode ).toBe( 302 );

            Topic.findAll()
            .then( ( topics ) => {
              expect( topics.length ).toBe( countBefore ); // unchanged
              done();
            } );
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:id/destroy ----- */


    describe( "GET /topics/:id/edit", () => {

      it( "should NOT render a view with an edit topic form " +
          "AND redirect to '/topics/:id' view", ( done ) => {

        const topic = this.topic; // "JS Frameworks"
        const url = `${ base }/${ topic.id }/edit`; // FORBIDDEN!

        request.get( url, ( err, res, body ) => {
          expect( err ).toBeNull();
          //expect( res.statusCode ).toBe( 302 );
          expect( body ).not.toContain( "<h1>Edit Topic</h1>" );
          expect( body ).toContain( `<h1>${ topic.title }</h1>` );
          done();
        } );
      } );

    } );
    /* END ----- GET /topics/:id/edit ----- */


    describe( "POST /topics/:id/update", () => {

      it( "should NOT update the topic with the given values", ( done ) => {

        const topic = this.topic; // "JS Frameworks"
        const topicId = topic.id;
        const before = { ...topic.get() };

        const url = `${ base }/${ topicId }/update`; // FORBIDDEN!
        const values = {
          title: "JavaScript Frameworks",
          description: "There are a lot of them."
        }
        const options = { url: url, form: values };

        request.post( options, ( err, res, body ) => {
          expect( err ).toBeNull();
          expect( res.statusCode ).toBe( 302 );

          Topic.findOne( { where: { id: topicId } } )
          .then( ( topic ) => {
            expect( topic.id ).toBe( before.id ); // unchanged
            expect( topic.title ).toBe( before.title ); // unchanged
            expect( topic.title ).not.toBe( values.title );
            expect( topic.description ).toBe( before.description ); // unchanged
            expect( topic.description ).not.toBe( values.description );
            done();
          } );
        } );
      } );

    } );
    /* END ----- POST /topics/:id/update ----- */

  } );
  /* END ----- member user CRUD operations ----- */

} );
/* END ----- routes : topics ----- */
