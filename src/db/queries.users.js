const User = require( "./models" ).User;
const bcrypt = require( "bcryptjs" );

module.exports = {

  createUser( newUser, callback ) {

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync( newUser.password, salt );

    return (
      User.create( { email: newUser.email, password: hash } )
      .then( ( user ) => { callback( null, user ); } )
      .catch( ( err ) => { callback( err ); } )
    )
  }

};
