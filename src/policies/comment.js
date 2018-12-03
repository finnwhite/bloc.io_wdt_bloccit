const ApplicationPolicy = require( "./application.js" );

class CommentPolicy extends ApplicationPolicy {

  //new() { return ( this._isMember() || this._isAdmin() ) }

}

module.exports = CommentPolicy;
