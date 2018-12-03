const commentQueries = require( "../db/queries.comments.js" );
const CommentPolicy = require( "../policies/comment.js" );

module.exports = {

  create( req, res, next ) {
    const isAuthorized = new CommentPolicy( req.user ).create();
    if ( isAuthorized ) {
      const values = {
        body: req.body.body,
        postId: req.params.postId,
        userId: req.user.id
      };
      commentQueries.addComment( values, ( err, comment ) => {
        if ( err ) { res.redirect( ".." ); } // .../posts/:postId
        else {
          req.flash( "notice", "Thank you for posting your comment!" );
          res.redirect( 303, ".." ); // .../posts/:postId
        }
      } );
    }
    else {
      req.flash( "notice", "You are not authorized to do that." );
      res.redirect( ".." ); // .../posts/:postId
    }
  }
  ,

  destroy( req, res, next ) {
    commentQueries.getComment( req.params.id, ( err, comment ) => {
      if ( err || !comment ) { res.redirect( ".." ); } // .../posts/:postId
      else {
        const isAuthorized = new CommentPolicy( req.user, comment ).destroy();
        if ( isAuthorized ) {
          commentQueries.deleteComment( comment.id, ( err, destroyedCount ) => {
            if ( err ) { res.redirect( "../.." ); } // .../posts/:postId
            else {
              req.flash( "notice", "The comment was successfully deleted." );
              res.redirect( 303, "../.." ); // .../posts/:postId
            } // .../posts/:postId
          } );
        }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          res.redirect( "../.." ); // .../posts/:postId
        }
      }
    } );
  }

};
