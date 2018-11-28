module.exports = {
  init( app ) {
    const staticRoutes = require( "../routes/static.js" );
    const topicRoutes = require( "../routes/topics.js" );
    const postRoutes = require( "../routes/posts.js" );
    const flairRoutes = require( "../routes/flairs.js" );
    const userRoutes = require( "../routes/users.js" );

    if ( process.env.NODE_ENV === "test" ) {
     const mockAuth = require( "../../spec/support/mock-auth.js" );
     mockAuth.init( app );
   }

    app.use( staticRoutes );
    app.use( topicRoutes );
    app.use( postRoutes );
    app.use( flairRoutes );
    app.use( userRoutes );
  }
};
