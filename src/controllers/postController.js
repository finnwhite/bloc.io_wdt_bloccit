const postQueries = require( "../db/queries.posts.js" );

module.exports = {

  new( req, res, next ) {
    res.render( "posts/new", { topicId: req.params.topicId } );
  }
  ,
  create( req, res, next ) {
    const newPost = {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId,
      userId: req.user.id
    };
    postQueries.addPost( newPost, ( err, post ) => {
      if ( err ) { res.redirect( 500, "./new" ); } // .../posts/new
      else { res.redirect( 303, `./${ post.id }` ); } // .../posts/:id
    } );
  }
  ,
  show( req, res, next ) {
    postQueries.getPost( req.params.id, ( err, post ) => {
      if ( err || post == null ) { res.redirect( 404, "/" ); }
      else { res.render( "posts/show", { post } ); }
    } );
  }
  ,
  destroy( req, res, next ) {
    postQueries.deletePost( req.params.id, ( err, destroyedCount ) => {
      if ( err ) { res.redirect( 500, "." ); } // .../posts/:id
      else { res.redirect( 303, "../.." ); } // /topics/:topicId
    } );
  }
  ,
  edit( req, res, next ) {
    postQueries.getPost( req.params.id, ( err, post ) => {
      if ( err || post == null ) { res.redirect( 404, "/" ); }
      else { res.render( "posts/edit", { post } ); }
    } );
  }
  ,
  update( req, res, next ) {
    postQueries.updatePost( req.params.id, req.body, ( err, post ) => {
      if ( err || post == null ) {
        res.redirect( 404, "./edit" ); // /topics/:topicId/posts/:id/edit
      }
      else { res.redirect( 303, "." ); } // .../posts/:id
    } );
  }

};
