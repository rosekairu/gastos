var React = require('react'),
    LinkedStateMixin = require('react-addons-linked-state-mixin'),
    History = require('react-router').History;

var ApiUtil = require('../../util/api_util'),
    ComponentActions = require('../../actions/component_actions'),
    FlashStore = require('../../stores/flash'),
    FlashActions = require('../../actions/flash_actions');

var AddAccountFormModal = React.createClass({
  mixins: [LinkedStateMixin, History],

  getInitialState: function() {
    return {
      userID: "",
      account_password: "",
      account_type: "",
      account_name: "",
      checked: false,
      flash: FlashStore.all()
    };
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

  toggleShowPassword: function () {
    this.setState({checked: !this.state.checked});
  },

  handleSubmit: function () {
    var instId = this.props.id;

    var account = {
      name: this.state.account_name,
      balance: ComponentActions.generateBalance(),
      account_type: ComponentActions.generateAccountType(),
      institution_id: instId
    };

    ApiUtil.createAccount(account, this.navToNewAccount);

  },

  navToNewAccount: function (id) {

    this.props.toggleModal();
    this.history.pushState(null, 'accounts/' + id, {});
  },

  goBack: function () {
    this.props.goBack();
  },

  submit: function (e) {
    e.preventDefault();
  },

  render: function () {
    var institution = this.props.inst,
        logo = this.props.logo,
        passwordInputType = "password",
        errors = "";

    if (this.state.checked) {
      passwordInputType = "text";
    }

    if (this.state.flash.length > 0) {
      errors = (
        <p className="session-form-errors">
          <i className="fa fa-exclamation-triangle" />
          {this.state.flash}
        </p>
      );

    }

    return (
      <div className="modal-edit-form">
        <h1 className="main-header">
          { this.props.inst }
        </h1>
        <form className="modal-form group" onSubmit={ this.submit }>
          {errors}
          <fieldset className="modal-form-fieldset">

            <div className="input">
              <label className="add-account-label">Account Name</label>
              <p className="add-account-label">Name your {institution} account</p>
              <input
                type="text"
                valueLink={this.linkState('account_name')} />
            </div>

            <div className="input">
              <label className="add-account-label">User ID</label>
              <p className="add-account-label">for your {institution} account</p>
              <input
                type="text"
                valueLink={this.linkState('userID')} />
            </div>

            <div className="input">
              <label className="add-account-label">Password</label>
              <p className="add-account-label">for your {institution} account</p>
              <input
                type={passwordInputType}
                valueLink={this.linkState('account_password')} />
            </div>

              <div className="input show-pass group">
                <input
                  id="checkbox"
                  onChange={this.toggleShowPassword}
                  type="checkbox" />
                <p>Show password</p>
              </div>

            <div className="submit group">
              <button
                className="add-account-submit"
                onClick={this.handleSubmit} >CONNECT SECURELY</button>
              <p onClick={this.goBack} className="go-back" to={"/"}>Go back</p>
            </div>
          </fieldset>
          <img className="preview-image" src={ logo } />
        </form>
      </div>
    );
  }

});

module.exports = AddAccountFormModal;
