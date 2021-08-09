var React = require('react'),
    History = require('react-router').History;

var AccountStore = require('../stores/account'),
    ApiUtil  = require('../util/api_util'),
    AccountTypeIndex = require('./account_type_index'),
    TransactionIndex = require('./transaction_index'),
    IndexSidebar = require('./sidebars/index_sidebar'),
    AccountShowSidebar = require('./sidebars/show_sidebar'),
    AccountShow = require('./account_show'),
    Header = require('./header'),
    ComponentActions = require('../actions/component_actions'),
    Search = require('./search'),
    Footer = require('./footer'),
    PieChart = require('./charts/pie_chart');

var AccountIndex = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return {
      accounts: AccountStore.all(),
      expanded: {},
      overviewClicked: true,
      transactionsClicked: false,
      accountClicked: false,
      filterAccountType: false,
      typeIds: null
    };
  },

  handleOverviewClick: function () {
    this.setState({overviewClicked: true, transactionsClicked: false, accountClicked: false});
  },

  handleAccountClick: function () {
    this.setState({accountClicked: true});
  },

  handleAllAccountsClick: function () {
    this.setState({overviewClicked: true, transactionsClicked: false, accountClicked: false});
  },


  handleTransactionsClick: function () {
    this.setState({overviewClicked: false, transactionsClicked: true});
  },

  componentDidMount: function () {
    ApiUtil.fetchAccounts();
    this.storeListener = AccountStore.addListener(this.onChange);
  },

  onChange: function () {
    this.setState({accounts: AccountStore.all()});
  },

  componentWillUnmount: function () {
    this.storeListener.remove();
  },


  render: function () {
    var that = this,
        accounts = this.state.accounts,
        accountClicked = this.state.accountClicked,
        overviewClicked = this.state.overviewClicked,
        transactionsClicked = this.state.transactionsClicked,
        overviewClass = ComponentActions.getOverviewClass(overviewClicked),
        accountsArr = ComponentActions.getAccountsArr(accounts),
        transactionClass = ComponentActions.getTransactionClass(transactionsClicked),
        modal = <div></div>;
        header = this.header();

    if (accountsArr.length === 0) {
      return this.newUserWelcome();
    } else if (accountClicked) {

      return (
        <div>
          {header}
          <AccountShow />
          <Footer />
        </div>
      );
    } else if (transactionsClicked){
      var headerText = this.headerText();
        return (
          <div>
            {header}
            <main className="root-content group">
              {this.accountShowSidebar()}
              <section className="root-content-main">
                {headerText}
                <TransactionIndex
                  filterAccountType={this.state.filterAccountType}
                  typeIds={this.state.typeIds} />
              </section>
            </main>
            <Footer />
          </div>);
    } else {
    return (
      <div>
        {header}
        <main className="root-content group">
          {this.indexSidebar()}

          <section className="root-content-main">
          <header className="root-content-main-header">
            <PieChart/>
            <h1>All Transactions</h1>

          </header>
            <TransactionIndex />
          </section>
        </main>
        <Footer />
      </div>);
    }
  },

  headerText: function () {
    if (!this.state.filterAccountType) {
      return <h1>Transactions</h1>;
    } else {
      var balanceClass = (this.typeBalance > 0) ? "" : "neg";

      return (
        <header >
          <h1 id="float-none">All {this.state.filterAccountType} Accounts</h1>
          <h6>TOTAL BALANCE</h6>
          <h5 className={balanceClass}>{accounting.formatMoney(this.typeBalance)}</h5>
        </header>
      );
      }
  },


  newUserWelcome: function () {
    return (
      <div>
        {header}
        <main className="root-content group">
          {this.indexSidebar()}

          <section className="root-content-main">
          <header className="root-content-main-header">
            <h1>Welcome to Gastos</h1>
          </header>
          <section>
            <p className="get-started">Let's get started! Try adding some accounts by clicking the pencil icon in the left sidebar. To improve the financial advice we provide, update your profile by clicking account on the navbar above.</p>

          </section>
          </section>
        </main>
        <Footer/>
      </div>);
  },

  accountShowSidebar: function () {
    return (
      <AccountShowSidebar
        accountTypeClick={this.handleAccountTypeClick}
        showAllAccounts="true"
        allAccountsClick={this.handleAllAccountsClick}
        accounts={this.state.accounts}
        accountClick={this.handleAccountClick}
        transactionsClick={this.handleTransactionsClick}
        />
    );
  },

  header: function () {
    var overviewClicked = this.state.overviewClicked,
        transactionsClicked = this.state.transactionsClicked;

    return (
      <Header
        overviewClicked={overviewClicked}
        transactionsClicked={transactionsClicked}
        overviewClick={this.handleOverviewClick}
        transactionsClick={this.handleTransactionsClick}/>
    );
  },

  indexSidebar: function () {
    return (
      <IndexSidebar
        accounts={this.state.accounts}
        accountClick={this.handleAccountClick}
        transactionsClick={this.handleTransactionsClick}
        />
    );
  },

  handleAccountTypeClick: function (type) {

    var typeAccounts = this.state.accounts[type];
    this.typeBalance = 0;
    var typeIds = typeAccounts.map(function(account) {
      this.typeBalance += parseInt(account.balance_n);
      return account.id;
    }.bind(this));

    this.setState({filterAccountType: type, typeIds: typeIds});
  },

});




module.exports = AccountIndex;
