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
      req.flash( "error", errors );
      return res.redirect( req.headers.referer );
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
      req.flash( "error", errors );
      return res.redirect( req.headers.referer );
    }
    else { return next(); }
  }
  ,
  validateComments( req, res, next ) {

    if ( req.method === "POST" ) {

      req.checkBody(
        "body", "comment must not be empty."
      ).notEmpty();

    }

    const errors = req.validationErrors();
    if ( errors ) {
      req.flash( "error", errors );
      return res.redirect( req.headers.referer );
    }
    else { return next(); }
  }
  ,
  validateUsers( req, res, next ) {

    if ( req.method === "POST" ) {

      req.checkBody(
        "email", "must be a valid email address."
      ).isEmail();

      req.checkBody(
        "password", "must be at least 6 characters in length."
      ).isLength( { min: 6 } );

      req.checkBody(
        "confirmation", "must match password provided."
      ).optional().matches( req.body.password );

    }

    const errors = req.validationErrors();
    if ( errors ) {
      req.flash( "error", errors );
      return res.redirect( req.headers.referer );
    }
    else { return next(); }
  }

};
