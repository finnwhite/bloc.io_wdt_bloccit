const Topic = require( "./models" ).Topic;
const Post = require( "./models" ).Post;

module.exports = {

  getAllTopics( callback ) {
    return Topic.findAll()
    .then( ( topics ) => { callback( null, topics ); } )
    .catch( ( err ) => { callback( err ); } );
  }
  ,
  addTopic( newTopic, callback ) {
    return Topic.create( newTopic )
    .then( ( topic ) => { callback( null, topic ); } )
    .catch( ( err ) => { callback( err ); } );
  }
  ,
  getTopic( id, callback ) {
    return Topic.findByPk( id, {
      include: [ { model: Post, as: "posts" } ]
    } )
    .then( ( topic ) => { callback( null, topic ); } )
    .catch( ( err ) => { callback( err ); } );
  }
  ,
  deleteTopic( id, callback ) {
    return Topic.destroy( { where: { id } } )
    .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
    .catch( ( err ) => { callback( err ); } );
  }
  ,
  updateTopic( id, updatedTopic, callback ) {
    return Topic.findByPk( id )
    .then( ( topic ) => {
      if ( !topic ) { return callback( "Topic not found." ); }
      topic.update( updatedTopic, {
        fields: Object.keys( updatedTopic )
      } )
      .then( ( affected ) => { callback( null, topic ); } )
      .catch( ( err ) => { callback( err ); } );
    } );
  }

};
