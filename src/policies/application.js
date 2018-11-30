class ApplicationPolicy {

  constructor( user, record ) {
    this.user = user;
    this.record = record;
  }

  _isSignedIn() { return Boolean( this.user ); }
  _isGuest() { return !this._isSignedIn(); }
  _isMember() { return this._isSignedIn(); }

  _isOwner() { return (
    this.user && this.record && ( this.record.userId == this.user.id )
  ) }
  _isAdmin() { return ( this.user && ( this.user.role === "admin" ) ) }

  new() { return this._isSignedIn(); }
  add() { return this.new(); }
  create() { return this.new(); }

  show() { return true; }
  view() { return this.show(); }
  read() { return this.show(); }

  edit() { return (
    this.new() && this.record && ( this._isOwner() || this._isAdmin() )
  ) }
  update() { return this.edit(); }

  destroy() { return this.update(); }
  delete() { return this.destroy(); }

}

module.exports = ApplicationPolicy;
