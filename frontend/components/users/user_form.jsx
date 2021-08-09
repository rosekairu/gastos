var React = require('react');
var History = require('react-router').History;

var UsersStore = require('../../stores/users_store'),
    UsersApiUtil = require('../../util/users_api_util'),
    FlashStore = require('../../stores/flash'),
    FlashActions = require('../../actions/flash_actions');

var UserForm = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return {flash: FlashStore.all()};
  },

  componentDidMount: function () {
    this.flashListener = FlashStore.addListener(this._updateFlash);
  },

  componentWillUnmount: function () {
    this.flashListener.remove();
    FlashActions.receiveFlash([]);
  },

  _updateFlash: function () {
    this.setState({flash: FlashStore.all()});
  },

  submit: function (e) {
    e.preventDefault();

    var credentials = $(e.currentTarget).serializeJSON();

    UsersApiUtil.createUser(credentials, function () {
      this.history.pushState({}, "/");
    }.bind(this));
  },

  render: function() {
    var errors;
    if (this.state.flash.length > 0) {
      var messages = this.state.flash.map(function(error, index) {
        return <li key={index}>{error}</li>;
      });
      errors = (
        <div className="user-form-errors group">
          <i className="fa fa-exclamation-triangle" />
          <ul>
            {messages}
          </ul>
        </div>
      );
    }
    return (
      <div>
        <header className="header">
          <nav className="header-nav group">

            <h1 className="header-logo">
              <a href="/"><img className="gastos-logo" src={window.Gastos.imageUrls.gastosLogo} alt="" /></a>
            </h1>

            <ul className="header-list group">
              <li>
                <a href="#/users/new" className="header-list-bold">Sign up</a>
              </li>
              <li><a href="#/login">Log in</a></li>
            </ul>

          </nav>
        </header>
        <main className="content group">
          <section className="content-main">

            <h1 className="main-header">See all your finances in one place & create a budget</h1>

            <form className="form group" onSubmit={ this.submit }>
              {errors}
              <fieldset className="form-fieldset">

                <div className="input">
                  <label>Your Email</label>
                  <input id="form-email" type="text" name="user[email]" />
                </div>

                <div className="input">
                  <label>Password</label>
                  <input id="form-password" type="password" name="user[password]" />
                </div>

                <div className="submit">
                  <button>SIGN UP</button>
                  <a href="/auth/facebook">Sign up with facebook</a>
                </div>
              </fieldset>
            </form>
          </section>
          <section className="content-sidebar">

            <h1 className="sidebar-header">
              Why you'll love it
            </h1>

            <ul className="sidebar-list">
              <li>See all your accounts in one place</li>
              <li>Set a budget and pay down your debt</li>
              <li>Find the best ways to grow your money</li>
              <li>Stay safe and secure</li>
            </ul>
          </section>
        </main>
      </div>
    );
  },

});

module.exports = UserForm;
