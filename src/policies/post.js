const ApplicationPolicy = require( "./application.js" );

class PostPolicy extends ApplicationPolicy {

  new() { return ( this._isMember() || this._isAdmin() ) }

}

module.exports = PostPolicy;
