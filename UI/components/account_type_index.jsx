var React = require('react'),
    History = require('react-router').History;

var AccountStore = require('../stores/account'),
    ApiUtil  = require('../util/api_util'),
    AccountIndex = require('./account_index'),
    ComponentActions = require('../actions/component_actions');

var AccountTypeIndex = React.createClass({
  mixins: [History],

  showAccount: function (account) {

    this.props.accountClick();
    this.props.transactionsClick();
    this.history.pushState(null, '/accounts/' + account.id, {});
  },

  totalAccountTypeBalance: function (account_type) {
    var sum = 0;

    this.state.accounts[account_type].forEach(function(account) {
      sum += parseFloat(account.balance_n);
    });

    return sum;
  },

  render: function () {
    var that = this,
        accounts = this.props.accounts;

    var mappedAccounts = accounts.map(function(account, index) {
      return (
        <li className="account-type-account group" key={index}  >
          <p1 onClick={that.showAccount.bind(null, account)} >{ComponentActions.sliceAccountName(account.name)}</p1>
          <p2 >{accounting.formatMoney(account.balance_n)}</p2>
        </li>);
    });

    return (
      <div className="accounts">
        {mappedAccounts}
      </div>
    );
  }

});

module.exports = AccountTypeIndex;
