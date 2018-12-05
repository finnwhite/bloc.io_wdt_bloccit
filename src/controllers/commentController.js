const commentQueries = require( "../db/queries.comments.js" );
const CommentPolicy = require( "../policies/comment.js" );

module.exports = {

  create( req, res, next ) {
    if ( new CommentPolicy( req.user ).create() ) {
      const values = {
        body: req.body.body,
        postId: req.params.postId,
        userId: req.user.id
      };
      commentQueries.addComment( values, ( err, comment ) => {
        if ( err ) { req.flash( "error", err ); }
        else { req.flash( "notice", "Thank you for posting your comment!" ); }
        res.redirect( req.headers.referer );
      } );
    }
    else {
      req.flash( "notice", "You are not authorized to do that." );
      res.redirect( req.headers.referer );
    }
  }
  ,
  destroy( req, res, next ) {
    commentQueries.getComment( req.params.id, ( err, comment ) => {
      if ( err || !comment ) { res.redirect( req.headers.referer ); }
      else {
        if ( new CommentPolicy( req.user, comment ).destroy() ) {
          commentQueries.deleteComment( comment.id, ( err, count ) => {
            if ( err ) { req.flash( "error", err ); }
            else {
              req.flash( "notice", "The comment was successfully deleted." );
            }
            res.redirect( req.headers.referer );
          } );
        }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          res.redirect( req.headers.referer );
        }
      }
    } );
  }

};
