var React = require('react');

var AccountTypeIndex = require('../account_type_index'),
    ComponentActions = require('../../actions/component_actions'),
    ModalIndex = require('../modals/modal_index');

var IndexSidebar = React.createClass({
  getInitialState: function () {
    return { expanded: {}, modalVisibile: false };
  },

  toggleModal: function () {
    this.setState({modalVisibile: !this.state.modalVisibile});
  },

  toggleExpand: function (type) {

    if (this.state.expanded[type] === undefined) {
      this.state.expanded[type] = false;
    } else {
      this.state.expanded[type] = !this.state.expanded[type];
    }

    this.forceUpdate();
  },

  totalAccountTypeBalance: function (accountType) {
    var sum = 0;

    this.props.accounts[accountType].forEach(function(account) {
      sum += parseFloat(account.balance_n);
    });

    return sum;
  },

  render: function () {
    var that = this,
        accounts = this.props.accounts,
        accountTypes = ComponentActions.getAccountTypes(accounts),
        accountBalances = ComponentActions.getAccountBalances(accounts),
        accountsArr = ComponentActions.getAccountsArr(accounts),
        mappedAccountTypes = this.getMappedAccountTypes(accountTypes, accountBalances, accounts),
        modal = <div></div>;

    if (this.state.modalVisibile) {
      modal = <ModalIndex location="accountIndex" toggleModal={this.toggleModal} />;
    }

    return (
      <section className="root-content-sidebar">
        {modal}
        <header className="group">
        <h1>Accounts</h1>
        <i onClick={this.toggleModal} className="fa fa-pencil"></i>
        </header>
        {mappedAccountTypes}
      </section>
    );
  },

  getMappedAccountTypes: function (accountTypes, accountBalances, accounts) {
    var that = this;
    var mappedAccountTypes = accountTypes.map(function(type){
      var typeIcon = that.getTypeIcon(type);
      var balanceClass = ComponentActions.getAccountBalanceClass(accountBalances[type]);
      var expandedAccounts;
      if (that.state.expanded[type] === undefined || that.state.expanded[type]) {
        expandedAccounts = (
            <AccountTypeIndex
              accountClick={that.props.accountClick}
              transactionsClick={that.props.transactionsClick}
              accounts={accounts[type]}/>
        );
      }

      return (
          <div key={type} className="account-balance-headers group" >
            <div onClick={that.toggleExpand.bind(null, type)} className="type-background group">
              <h3>{typeIcon}{type}</h3>
              <h4 className={balanceClass} > {accounting.formatMoney(accountBalances[type])}</h4>
            </div>
          {expandedAccounts}
        </div>
      );
    });

    return mappedAccountTypes;
  },

  getTypeIcon: function (type) {

    if (type === "Cash") {
      return <i className="fa fa-money"></i>;
    } else if (type === "Credit Cards") {
      return <i className="fa fa-credit-card-alt"></i>;
    } else if (type === "Loan") {
      return <i className="fa fa-home"></i>;
    } else {
      return <i className="fa fa-line-chart"></i>;
    }
  }

});


module.exports = IndexSidebar;
