const voteQueries = require( "../db/queries.votes.js" );

const UPVOTE = 1;
const DOWNVOTE = -1;

module.exports = {

  upvote( req, res, next ) {
    const isAuthorized = Boolean( req.user );
    if ( isAuthorized ) {
      const values = {
        value: UPVOTE,
        postId: req.params.postId,
        userId: req.user.id
      };
      voteQueries.setVote( values, ( err, vote ) => {
        if ( err ) { req.flash( "error", err ); }
        //req.flash( "notice", "Thank you for your vote!" );
        res.redirect( 303, ".." ); // .../posts/:postId
      } );
    }
    else {
      req.flash( "notice", "You must be signed in to do that." );
      res.redirect( ".." ); // .../posts/:postId
    }
  }
  ,
  downvote( req, res, next ) {
    const isAuthorized = Boolean( req.user );
    if ( isAuthorized ) {
      const values = {
        value: DOWNVOTE,
        postId: req.params.postId,
        userId: req.user.id
      };
      voteQueries.setVote( values, ( err, vote ) => {
        if ( err ) { req.flash( "error", err ); }
        //req.flash( "notice", "Thank you for your vote." );
        res.redirect( 303, ".." ); // .../posts/:postId
      } );
    }
    else {
      req.flash( "notice", "You must be signed in to do that." );
      res.redirect( ".." ); // .../posts/:postId
    }
  }

};
