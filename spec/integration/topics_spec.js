const request = require( "request" );
const server = require( "../../src/server.js" );
const base = "http://localhost:3000/topics";

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;

describe( "routes : topics", () => {

  beforeEach( ( done ) => {
    this.topic;
    sequelize.sync( { force: true } )
    .then( ( res ) => {
      Topic.create( {
        title: "JS Frameworks",
        description: "There are a lot of them."
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

  describe( "GET /topics", () => {

    it( "should return status code 200 AND all topics", ( done ) => {
      request.get( base, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 200 );
        expect( err ).toBeNull();
        expect( body ).toContain( "Topics" );
        expect( body ).toContain( "JS Frameworks" );
        done();
      } );
    } );

  } );
  /* END ----- GET /topics ----- */

  describe( "GET /topics/new", () => {

    it( "should render a new topic form", ( done ) => {
      request.get( `${ base }/new`, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "New Topic" );
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/new ----- */

  describe( "POST /topics/create", () => {

    it( "should create a new topic and redirect", ( done ) => {

      const options = {
        url: `${ base }/create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?"
        }
      };

      request.post( options, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 303 );

        Topic.findOne( { where: { title: options.form.title } } )
        .then( ( topic ) => {
          expect( topic.title ).toBe( options.form.title );
          expect( topic.description ).toBe( options.form.description );
          done();
        } )
        .catch( ( err ) => {
          console.log( err );
          done();
        } );
      } );
    } );

    it( "should NOT create a new topic that fails validations", ( done ) => {

      const options = {
        url: `${ base }/create`,
        form: { title: "test", description: "testing" }
      };

      request.post( options, ( err, res, body ) => {
        expect( res.statusCode ).toBe( 303 );

        Topic.findOne( { where: { title: options.form.title } } )
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
      const url = `${ base }/${ this.topic.id }`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "JS Frameworks" );
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
        expect( countBefore ).toBe( 1 );

        const url = `${ base }/${ this.topic.id }/destroy`;
        request.post( url, ( err, res, body ) => {
          Topic.findAll()
          .then( ( topics ) => {
            expect( err ).toBeNull();
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
      const url = `${ base }/${ this.topic.id }/edit`;
      request.get( url, ( err, res, body ) => {
        expect( err ).toBeNull();
        expect( body ).toContain( "Edit Topic" );
        expect( body ).toContain( "JS Frameworks" );
        done();
      } );
    } );

  } );
  /* END ----- GET /topics/:id/edit ----- */

  describe( "POST /topics/:id/update", () => {

    it( "should update the topic with the given values", ( done ) => {

      const options = {
        url: `${ base }/${ this.topic.id }/update`,
        form: {
          title: "JavaScript Frameworks",
          description: "There are a lot of them"
        }
      };

      request.post( options, ( err, res, body ) => {
        expect( err ).toBeNull();
        Topic.findOne( { where: { id: this.topic.id } } )
        .then( ( topic ) => {
          expect( topic.title ).toBe( options.form.title );
          done();
        } );
      } );
    } );

  } );
  /* END ----- POST /topics/:id/update ----- */

} );
/* END ----- routes : topics ----- */
