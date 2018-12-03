const Topic = require( "./models" ).Topic;
const Post = require( "./models" ).Post;

module.exports = {

  getAllTopics( callback ) {
    return (
      Topic.findAll()
      .then( ( topics ) => { callback( null, topics ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  addTopic( values, callback ) {
    return (
      Topic.create( values )
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
  deleteTopic( id, callback ) {
    return (
      Topic.destroy( { where: { id } } )
      .then( ( destroyedCount ) => { callback( null, destroyedCount ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }
  ,
  updateTopic( id, updates, callback ) {
    return (
      Topic.findByPk( id )
      .then( ( topic ) => {
        if ( !topic ) { return callback( 404 ); } // 404 Not Found

        topic.update( updates, { fields: Object.keys( updates ) } )
        .then( ( topic ) => { callback( null, topic ); } )
        .catch( ( err ) => { callback( err ); } )
      } )
    )
  }

};
