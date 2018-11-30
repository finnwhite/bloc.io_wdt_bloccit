const postQueries = require( "../db/queries.posts.js" );
const PostPolicy = require( "../policies/post.js" );

module.exports = {

  new( req, res, next ) {
    const topicId = req.params.topicId
    const isAuthorized = new PostPolicy( req.user ).new();
    if ( isAuthorized ) { res.render( "posts/new", { topicId } ); }
    else {
      req.flash( "notice", "You are not authorized to do that." );
      res.redirect( ".." ); // /topics/:topicId
    }
  }
  ,
  create( req, res, next ) {
    const isAuthorized = new PostPolicy( req.user ).create();
    if ( isAuthorized ) {
      const values = {
        title: req.body.title,
        body: req.body.body,
        topicId: req.params.topicId,
        userId: req.user.id
      };
      postQueries.addPost( values, ( err, post ) => {
        if ( err ) { res.redirect( ".." ); } // /topics/:topicId
        else { res.redirect( 303, `./${ post.id }` ); } // .../posts/:id
      } );
    }
    else {
      req.flash( "notice", "You are not authorized to do that." );
      res.redirect( ".." ); // /topics/:topicId
    }
  }
  ,

  show( req, res, next ) {
    postQueries.getPost( req.params.id, ( err, post ) => {
      if ( err || !post ) { res.redirect( ".." ); } // /topics/:topicId
      else { res.render( "posts/show", { post } ); }
    } );
  }
  ,

  destroy( req, res, next ) {
    postQueries.getPost( req.params.id, ( err, post ) => {
      if ( err || !post ) { res.redirect( "../.." ); } // /topics/:topicId
      else {
        const isAuthorized = new PostPolicy( req.user, post ).destroy();
        if ( isAuthorized ) {
          postQueries.deletePost( post.id, ( err, post ) => {
            if ( err ) { res.redirect( "." ); } // .../posts/:id
            else { res.redirect( 303, "../.." ); } // /topics/:topicId
          } );
        }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          res.redirect( "." ); // .../posts/:id
        }
      }
    } );
  }
  ,
  edit( req, res, next ) {
    postQueries.getPost( req.params.id, ( err, post ) => {
      if ( err || !post ) { res.redirect( "../.." ); } // /topics/:topicId
      else {
        const isAuthorized = new PostPolicy( req.user, post ).edit();
        if ( isAuthorized ) { res.render( "posts/edit", { post } ); }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          res.redirect( "." ); // .../posts/:id
        }
      }
    } );
  }
  ,
  update( req, res, next ) {
    postQueries.getPost( req.params.id, ( err, post ) => {
      if ( err || !post ) { res.redirect( "../.." ); } // /topics/:topicId
      else {
        const isAuthorized = new PostPolicy( req.user, post ).update();
        if ( isAuthorized ) {
          postQueries.updatePost( post.id, req.body, ( err, post ) => {
            if ( err ) { res.redirect( "./edit" ); } // .../posts/:id/edit
            else { res.redirect( 303, "." ); } // .../posts/:id
          } );
        }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          res.redirect( "." ); // .../posts/:id
        }
      }
    } );
  }

};
