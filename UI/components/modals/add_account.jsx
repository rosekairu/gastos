var React = require('react');

var InstitutionStore = require('../../stores/institution'),
    AddAccountFormModal = require('./add_account_form'),
    ApiUtil = require('../../util/api_util');

var AddAccountModal = React.createClass({
  getInitialState: function () {
    return {institutions: InstitutionStore.all(), institution: null};
  },

  componentDidMount: function() {
    this.storeListener = InstitutionStore.addListener(this.onChange);
    ApiUtil.fetchInstitutions();
  },

  componentWillUnmount: function() {
    this.storeListener.remove();
  },

  onChange: function () {
    this.setState({institutions: InstitutionStore.all()});
  },

  selectInstitution: function (inst) {
    this.setState({institution: inst});
  },

  unselectInstitution: function () {
    this.setState({institution: null});
  },

  goBack: function () {
    this.props.goBack();
  },

  render: function () {

    var inst = this.state.institution,
        insts = this.state.institutions,
        that = this;

    if (!insts) { return <div></div>; }

    var institutions = insts.map(function(inst, index) {
      return (
        <li
          className="group"
          onClick={that.selectInstitution.bind(null, inst)}
          key={index}>
          <img className="inst-logo" src={inst.logo_url} />
          <p>{inst.name}</p>
        </li>
      );
    });

    if (inst) {
      return (
        <AddAccountFormModal
          toggleModal={this.props.toggleModal}
          goBack={this.unselectInstitution}
          inst={inst.name}
          logo={inst.logo_url}
          id={inst.id} />
      );
    } else {
      return (
        <div className="modal-edit-form">
          <h1 className="main-header-account">
            Choose from these popular Gastos accounts
          </h1>
          <p>Note: Financial institutions don't have public APIs that allow third-party sites  to access account information such as transaction history and balance. In fact, Mint.com uses a data aggregation agent, Intuit, to do this for them. Therefore, this feature is only a demo simulation. You can provide fake account data, and Gastos will populate an account with transactions and a balance.</p>
          <ul className="modal-edit-institutions">
            {institutions}
          </ul>
          <p id="add-account-back" onClick={this.goBack} className="go-back" to={"/"}>Go back</p>
        </div>
      );
    }
  }

});

module.exports = AddAccountModal;
