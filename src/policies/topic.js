const ApplicationPolicy = require( "./application.js" );

class TopicPolicy extends ApplicationPolicy {

  new() { return this._isAdmin(); }

  edit() { return this._isAdmin(); }

}

module.exports = TopicPolicy;
