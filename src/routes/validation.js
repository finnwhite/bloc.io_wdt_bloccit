module.exports = {

  validateTopics( req, res, next ) {

    if ( req.method === "POST" ) {

      req.checkBody(
        "title", "must be 5 or more characters in length."
      ).isLength( { min: 5 } );

      req.checkBody(
        "description", "must be 10 or more characters in length."
      ).isLength( { min: 10 } );

    }

    const errors = req.validationErrors();
    if ( errors ) {
      req.flash( "errors", errors );
      return res.redirect( 303, req.headers.referer );
    }
    else { return next(); }
  }
  ,
  validatePosts( req, res, next ) {

    if ( req.method === "POST" ) {

      req.checkParams(
        "topicId", "must be valid"
      ).notEmpty().isInt();

      req.checkBody(
        "title", "must be 2 or more characters in length."
      ).isLength( { min: 2 } );

      req.checkBody(
        "body", "must be 10 or more characters in length."
      ).isLength( { min: 10 } );

    }

    const errors = req.validationErrors();
    if ( errors ) {
      req.flash( "errors", errors );
      return res.redirect( 303, req.headers.referer );
    }
    else { return next(); }
  }

};
