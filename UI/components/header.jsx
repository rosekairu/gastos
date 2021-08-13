var React = require('react'),
    History = require('react-router').History,
    EditUserFormModal = require('./modals/edit_user_form'),
    ModalIndex = require('./modals/modal_index');

var CurrentUserStore = require('../stores/current_user_store'),
    SessionsApiUtil = require('../util/sessions_api_util');

var Header = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return { currentUser: CurrentUserStore.currentUser(), modalVisibile: false };
  },

  componentDidMount: function () {
    this.storeListener = CurrentUserStore.addListener(this._onChange);
  },

  componentWillUnmount: function () {
    this.storeListener.remove();
  },

  _onChange: function () {
    this.setState({currentUser: CurrentUserStore.currentUser()});
  },

  toggleModal: function () {
    this.setState({modalVisibile: !this.state.modalVisibile});
  },

  handleOverviewClick: function () {
    this.props.overviewClick();
  },

  handleTransactionsClick: function () {
    this.props.transactionsClick();
  },

  logout: function () {
    SessionsApiUtil.logout(function () {
      this.history.pushState(null, "/login", {});
    }.bind(this));
  },

  render: function() {
    var overviewClass = "overview",
        transactionClass = "transaction",
        modal = <div></div>;

    if (this.props.overviewClicked) {
      overviewClass = "content-header-list-selected";
    } else {
      transactionClass = "content-header-list-selected";
    }

    if (this.state.modalVisibile) {
      modal = <ModalIndex location="user" toggleModal={this.toggleModal} />;
    }

    if (CurrentUserStore.isLoggedIn()) {
        return (
          <div>
            {modal}
            <header className="root-header">
              <nav className="root-header-nav group">

                <ul className="root-header-list group">
                  <li>
                    <p onClick={this.toggleModal}>Hi {this.state.currentUser.email}</p>
                  </li>
                  <li><p onClick={this.toggleModal}>Accounts</p></li>
                  <li><form onSubmit={this.logout}>
                    <button>Log Out</button></form></li>
                </ul>

              </nav>
            </header>
            <header className="content-header">
              <nav className="content-header-nav group">

                <h1 className="content-header-logo">
                  <img className="gastos-logo" src={window.Gastos.imageUrls.gastosLogo} alt="" />
                </h1>

                <ul className="content-header-list group">
                  <li className={overviewClass}><a onClick={this.handleOverviewClick} href="#">Overview</a></li>
                  <li className={transactionClass}><a onClick={this.handleTransactionsClick} href="#">Transactions</a></li>
                </ul>

              </nav>
            </header>
          </div>
        );
    } else {
      return (
        <div>
        </div>
      );
    }

  },

});

module.exports = Header;
