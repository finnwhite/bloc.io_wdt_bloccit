const Vote = require( "../../src/db/models" ).Vote;

module.exports = {

  setVote( values, callback ) {
    const where = { userId: values.userId, postId: values.postId };
    return (
      Vote.findOne( { where } )
      .then( ( vote ) => {
        if ( vote ) { // update existing vote
          vote.value = values.value;
          vote.save()
          .then( ( vote ) => { callback( null, vote ); } )
          .catch( ( err ) => { callback( err ); } );
        }
        else { // add new vote
          Vote.create( values )
          .then( ( vote ) => { callback( null, vote ); } )
          .catch( ( err ) => { callback( err ); } )
        }
      } )
    )
  }

};
