var React = require('react');

var AddAccountModal = require('./add_account'),
    EditUserFormModal = require('./edit_user_form'),
    EditAccountModal = require('./edit_account_modal');

var ModalIndex = React.createClass({

  getInitialState: function () {
    this.initalLocation = this.props.location;
    return { modalBody: this.props.location, location: this.props.location };
  },

  closeModal: function () {
    this.props.toggleModal();
  },

  renderAccountBody: function () {
    if (this.state.modalBody !== "accounts") {
      this.setState({modalBody: "accounts", location: "accountIndex"});
    }
  },

  renderUserBody: function () {
    if (this.state.modalBody !== "user") {
      this.setState({modalBody: "user", location: "user"});
    }
  },

  render: function () {
    var accountsClass= "",
        userClass= "",
        divClass = "modal-index",
        editUserForm = <EditUserFormModal toggleModal={this.closeModal}/>,
        addAccountModal = <EditAccountModal toggleModal={this.closeModal}/>;

    var modalBody = (this.state.modalBody === "user") ? editUserForm : addAccountModal;

    if (this.state.location === "user") {
      userClass = "selected";
      accountsClass = "";
    } else if (this.state.location === "accountIndex"){
      accountsClass = "selected";
      userClass = "";
    } else if (this.state.location === "accountShow") {
      accountsClass = "selected";
      userClass = "";
    }
    if (this.initalLocation === "accountIndex") {
      divClass = "modal-account-index";
    } else if (this.initalLocation === "accountShow") {
      divClass = "modal-account-show";
    }

    return (
      <div>
        <div onClick={this.closeModal} className="transparent-wrapper"></div>
        <div className={divClass}>
          <header className="modal-index-header">
            <ul className="modal-header-list group">
              <li
                className={accountsClass}
                onClick={this.renderAccountBody}><i id="fa-account-modal" className="fa fa-folder-open"></i><p>Accounts</p></li>
              <li
                className={userClass}
                onClick={this.renderUserBody}><i id="fa-user-modal" className="fa fa-user fa-modal"></i><p>About Me</p></li>
            </ul>
          </header>
          {modalBody}
          <footer className="modal-index-footer submit group">
            <button
              onClick={this.closeModal}>Close</button>
          </footer>
        </div>
      </div>

    );
  }
});

module.exports = ModalIndex;
