var React = require('react');
var History = require('react-router').History;
var SessionsApiUtil = require('./../../util/sessions_api_util'),
    FlashStore = require('../../stores/flash'),
    FlashActions = require('../../actions/flash_actions');


var SessionForm = React.createClass({
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
    SessionsApiUtil.login(credentials, function () {
      this.history.pushState({}, "/");
    }.bind(this));
  },


  render: function() {
    var errors = "";
    if (this.state.flash.length > 0) {
      errors = (
        <p className="session-form-errors group">
          <i className="fa fa-exclamation-triangle" />
          {this.state.flash}
        </p>
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
              <li><a href="#/users/new" >Sign up</a></li>
              <li><a href="#/login" className="header-list-bold">Log in</a></li>
            </ul>

          </nav>
        </header>

        <main className="content group">
          <section className="content-main">

            <h1 className="main-header">Log in to Gastos</h1>

        <form className="form group" onSubmit={ this.submit }>
           {errors}
          <fieldset className="form-fieldset">

            <div className="input">
              <label>Email</label>
              <input id="form-email" type="text" name="user[email]" />
            </div>

            <div className="input">
              <label>Password</label>
              <input id="form-password" type="password" name="user[password]" />
            </div>


            <div className="submit">
              <button>LOG IN</button>
              <a href="/auth/facebook">Log in with facebook</a>
            </div>
          </fieldset>
        </form>

        <form className="form group" onSubmit={ this.submit }>
          <input type="hidden" name="user[email]" value="test@test.com" />
          <input type="hidden" name="user[password]" value="password" />
          <div className="submit">
            <button>LOG IN AS GUEST</button>
          </div>
        </form>
      </section>

      <section className="login-content-sidebar">

        <p className="content-sidebar-link">
          Don't have an account?
        </p>
        <a className="signup-link" href="#/users/new">Sign up now for free</a>

      </section>
    </main>
  </div>
    );
  },

});

module.exports = SessionForm;
