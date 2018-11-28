const topicQueries = require( "../db/queries.topics.js" );
const TopicPolicy = require( "../policies/topic.js" );

module.exports = {

  index( req, res, next ) {
    topicQueries.getAllTopics( ( err, topics ) => {
      if ( err ) { res.redirect( "/" ); }
      else { res.render( "topics/index", { topics } ); }
    } );
  }
  ,
  new( req, res, next ) {
    const isAuthorized = new TopicPolicy( req.user ).new();
    if ( isAuthorized ) { res.render( "topics/new" ); }
    else {
      req.flash( "notice", "You are not authorized to do that." );
      res.redirect( "/topics" );
    }
  }
  ,
  create( req, res, next ) {
    const isAuthorized = new TopicPolicy( req.user ).create();
    if ( isAuthorized ) {
      const newTopic = {
        title: req.body.title,
        description: req.body.description
      };
      topicQueries.addTopic( newTopic, ( err, topic ) => {
        if ( err ) { res.redirect( "/topics/new" ); }
        else { res.redirect( 303, `/topics/${ topic.id }` ); }
      } );
    }
    else {
      req.flash( "notice", "You are not authorized to do that." );
      res.redirect( "/topics" );
    }
  }
  ,
  show( req, res, next ) {
    topicQueries.getTopic( req.params.id, ( err, topic ) => {
      if ( err || topic == null ) { res.redirect( "/topics" ); }
      else { res.render( "topics/show", { topic } ); }
    } );
  }
  ,
  destroy( req, res, next ) {
    topicQueries.deleteTopic( req, ( err, topic ) => {
      if ( err ) { res.redirect( `/topics/${ req.params.id }` ); }
      else { res.redirect( 303, "/topics" ); }
    } );
  }
  ,
  edit( req, res, next ) {
    const topicId = req.params.id;
    topicQueries.getTopic( topicId, ( err, topic ) => {
      if ( err || topic == null ) { res.redirect( "/topics" ); }
      else {
        const isAuthorized = new TopicPolicy( req.user, topic ).edit();
        if ( isAuthorized ) { res.render( "topics/edit", { topic } ); }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          res.redirect( `/topics/${ topicId }` );
        }
      }
    } );
  }
  ,
  update( req, res, next ) {
    topicQueries.updateTopic( req, req.body, ( err, topic ) => {
      if ( err || topic == null ) {
        res.redirect( `/topics/${ req.params.id }/edit` );
      }
      else { res.redirect( 303, `/topics/${ topic.id }` ); }
    } );
  }

};
