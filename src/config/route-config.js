module.exports = {
  init( app ) {
    const staticRoutes = require( "../routes/static.js" );

    const userRoutes = require( "../routes/users.js" );
    const topicRoutes = require( "../routes/topics.js" );
    const postRoutes = require( "../routes/posts.js" );
    const commentRoutes = require( "../routes/comments.js" );
    const voteRoutes = require( "../routes/votes.js" );
    const favoriteRoutes = require( "../routes/favorites.js" );

    const flairRoutes = require( "../routes/flairs.js" );


    if ( process.env.NODE_ENV === "test" ) {
     const mockAuth = require( "../../spec/support/mock-auth.js" );
     mockAuth.init( app );
   }


    app.use( staticRoutes );

    app.use( userRoutes );
    app.use( topicRoutes );
    app.use( postRoutes );
    app.use( commentRoutes );
    app.use( voteRoutes );
    app.use( favoriteRoutes );

    app.use( flairRoutes );

  }
};
