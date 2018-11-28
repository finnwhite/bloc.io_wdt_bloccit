const Topic = require( "./models" ).Topic;
const Post = require( "./models" ).Post;
const TopicPolicy = require( "../policies/topic.js" );

module.exports = {

  getAllTopics( callback ) {
    return (
      Topic.findAll()
      .then( ( topics ) => { callback( null, topics ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  addTopic( newTopic, callback ) {
    return (
      Topic.create( newTopic )
      .then( ( topic ) => { callback( null, topic ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  getTopic( id, callback ) {
    return (
      Topic.findByPk( id, { include: [ { model: Post, as: "posts" } ] } )
      .then( ( topic ) => { callback( null, topic ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  deleteTopic( req, callback ) {
    return (
      Topic.findByPk( req.params.id )
      .then( ( topic ) => {
        if ( !topic ) { return callback( 404 ); } // 404 Not Found

        const isAuthorized = new TopicPolicy( req.user, topic ).destroy();
        if ( isAuthorized ) {
          topic.destroy()
          .then( () => { callback( null, topic ); } )
          .catch( ( err ) => { callback( err ); } );
        }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          callback( 403 ); // 403 Forbidden
        }
      } )
    )
  }
  ,
  updateTopic( req, updatedTopic, callback ) {
    return (
      Topic.findByPk( req.params.id )
      .then( ( topic ) => {
        if ( !topic ) { return callback( 404 ); } // 404 Not Found

        const isAuthorized = new TopicPolicy( req.user, topic ).update();
        if ( isAuthorized ) {
          topic.update( updatedTopic, { fields: Object.keys( updatedTopic ) } )
          .then( ( topic ) => { callback( null, topic ); } )
          .catch( ( err ) => { callback( err ); } );
        }
        else {
          req.flash( "notice", "You are not authorized to do that." );
          callback( 403 ); // 403 Forbidden
        }
      } )
    )
  }

};
