const voteQueries = require( "../db/queries.votes.js" );

const UPVOTE = 1;
const DOWNVOTE = -1;

module.exports = {

  upvote( req, res, next ) {
    if ( req.user ) {
      const values = {
        value: UPVOTE,
        postId: req.params.postId,
        userId: req.user.id
      };
      voteQueries.setVote( values, ( err, vote ) => {
        if ( err ) { req.flash( "error", err ); }
        //else { req.flash( "notice", "Thank you for your vote!" ); }
        res.redirect( req.headers.referer );
      } );
    }
    else {
      req.flash( "notice", "You must be signed in to do that." );
      res.redirect( req.headers.referer );
    }
  }
  ,
  downvote( req, res, next ) {
    if ( req.user ) {
      const values = {
        value: DOWNVOTE,
        postId: req.params.postId,
        userId: req.user.id
      };
      voteQueries.setVote( values, ( err, vote ) => {
        if ( err ) { req.flash( "error", err ); }
        //else { req.flash( "notice", "Thank you for your vote." ); }
        res.redirect( req.headers.referer );
      } );
    }
    else {
      req.flash( "notice", "You must be signed in to do that." );
      res.redirect( req.headers.referer );
    }
  }

};
