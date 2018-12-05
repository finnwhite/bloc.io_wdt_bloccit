const ApplicationPolicy = require( "./application.js" );

class FavoritePolicy extends ApplicationPolicy {

  destroy() { return this._isOwner(); }

}

module.exports = FavoritePolicy;
