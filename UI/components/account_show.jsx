var React = require('react'),
    History = require('react-router').History;

var AccountStore =require('../stores/account'),
    ApiUtil = require('../util/api_util'),
    TransactionIndex = require('./transaction_index'),
    Header = require('./header'),
    AccountShowSidebar = require('./sidebars/show_sidebar'),
    TransactionIndexItem = require('./transaction_index_item'),
    ComponentActions = require('../actions/component_actions'),
    TransactionItemForm = require('./transaction_form'),
    TransactionStore = require('../stores/transaction'),
    Footer = require('./footer'),
    Search = require('./search');

var AccountShow = React.createClass({
  mixins: [History],

  getInitialState: function () {
    var accountId = this.props.params.accountId;

    return {
      account: AccountStore.find(accountId),
      transactions: TransactionStore.all(),
      allAccounts: AccountStore.all(),
      overviewClicked: false,
      transactionsClicked: true,
      formIndex: 0,
      inSearch: false,
      totalCount: TransactionStore.all().length,
      query: null,
      filterAccountType: false,
      typeIds: null,
      page: 1,
      sortDate: false,
      sortDateASC: false,
      sortCat: false,
      sortCatASC: false,
      sortAmount: false,
      sortAmountASC: false,
      sortDesc: false,
      sortDescASC: false
    };
  },

  componentDidMount: function () {
    ApiUtil.fetchAccounts();
    ApiUtil.fetchAccount(parseInt(this.props.params.accountId));
    ApiUtil.fetchAccountTransactions(this.props.params.accountId);
    this.transactionListener = TransactionStore.addListener(this.onChange);
  },

  nextPage: function () {
    var nextPage = this.state.page + 1;
    this.setState({page: nextPage});
  },

  backPage: function () {
    var backPage = this.state.page - 1;
    this.setState({page: backPage});
  },

  componentWillReceiveProps: function (newProps) {
    var newId = newProps.params.accountId;

    if (typeof AccountStore.find(newId) === "undefined") {
      this.history.pushState(null, '/', {});
    } else if ( this.state.account && parseInt(newProps.params.accountId) !== this.state.account.id ){
      // ApiUtil.fetchAccount(parseInt(newProps.params.accountId));
      // ApiUtil.fetchAccount(parseInt(newProps.params.accountId));
      ApiUtil.fetchAccountTransactions(newProps.params.accountId);
      this.setState({formIndex: 0, inSearch: false, account: AccountStore.find(newProps.params.accountId.accountId)});
    }
  },

  onChange: function () {
    var accountId = this.props.params.accountId;
    if (this.state.inSearch) {
      var transactions = this.findNewTransactions();
      this.setState({
        transactions: transactions,
        totalCount: transactions.length
      });
    } else {
      this.setState({
        account: AccountStore.find(accountId),
        allAccounts: AccountStore.all(),
        transactions: TransactionStore.all(),
        totalCount: TransactionStore.all().length
      });
    }
  },

  findNewTransactions: function () {

    var newTransactions = [];
    this.state.transactions.forEach(function(transaction) {
      newTransactions.push(TransactionStore.find(transaction.id));
    });
    return newTransactions;
  },

  componentWillUnmount: function () {
    this.transactionListener.remove();
  },

  handleAccountTypeClick: function (type) {
    var typeAccounts = this.state.allAccounts[type];
    this.typeBalance = 0;
    var typeIds = typeAccounts.map(function(account) {
      this.typeBalance += parseInt(account.balance_n);
      return account.id;
    }.bind(this));

    this.setState({
      filterAccountType: type,
      typeIds: typeIds,
      inSearch: false,
      totalCount: null
    });
  },

  handleSearch: function (transactions, query, totalCount) {
    if (query !== "") {
      this.setState({
        transactions: transactions,
        query: query,
        inSearch: true,
        totalCount: totalCount,
        page: 1
      });
    }
    else {
      this.setState({
        transactions: TransactionStore.all(),
        inSearch: false,
        page: 1,
        totalCount: TransactionStore.all().length
      });
    }
  },

  handleOverviewClick: function () {
    this.history.pushState(null, 'accounts', {});
  },

  handleTransactionsClick: function () {
    this.history.pushState(null, 'accounts', {});
  },

  handleAccountClick: function () {
    this.setState({
      accountClicked: true,
      filterAccountType: false,
      inSearch: false
    });
  },

  handleAllAccountsClick: function (e) {
    e.preventDefault();
    this.history.pushState(null, 'accounts', {});
  },

  makeFormIndex: function (index) {
    this.setState({formIndex: index});
  },

  render: function () {

    var that = this,
        page = this.state.page,
        account = this.state.account,
        transactions = this.state.transactions,
        accounts = this.state.allAccounts,
        transactionsClicked =this.state.transactionsClicked,
        overviewClicked =this.state.overviewClicked,
        inSearch = this.state.inSearch,
        overviewClass = ComponentActions.getOverviewClass(overviewClicked),
        transactionClass = ComponentActions.getTransactionClass(transactionsClicked),
        header = this.header(),
        sidebar = this.accountShowSidebar();

    if (!(account && transactions)) { return <div>To give you the freshest possible info, your accounts are now updating… this will only take a moment.</div>; }

      if (this.state.sortDate) {
        transactions = this.sortDate();
      } else if (this.state.sortCat) {
        transactions = this.sortCat();
      } else if (this.state.sortDesc) {
        transactions = this.sortDesc();
      } else if (this.state.sortAmount) {
        transactions = this.sortAmount();
      }

    var headerText = this.headerText(),
        search = <Search search={this.handleSearch} account={account.id} />,
        totalCount = this.state.totalCount,
        firstResult = (page - 1) * 25,
        lastResult = (transactions.length > firstResult + 25) ? firstResult + 25 : transactions.length,
        resultText = this.resultText(transactions, firstResult, totalCount, lastResult),
        slicedTransactions = transactions.slice( firstResult, lastResult );

    if (this.state.filterAccountType) {
      var newTransactions = this.filterTransactionsByType();
      lastResult = (newTransactions.length > firstResult + 25) ? firstResult + 25 : newTransactions.length;
      transactions = newTransactions.slice(firstResult, lastResult);
      totalCount = newTransactions.length;
    }


    var mappedBody = this.mapBody(slicedTransactions);

    if (this.state.filterAccountType) {

      return (
        <div>
          {header}
        <main className="root-content group">

          {sidebar}

          <section className="root-content-main">
            {headerText}

            <TransactionIndex
              transactions={this.state.transactions}
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

            {sidebar}

            <section className="root-content-main group">
              {headerText}
              {search}
              {resultText}
              <table className="transaction-table group">
                <thead className="transaction-table-header">
                  <tr >
                    <th onClick={this.toggleSortState} className="date">Date</th>
                    <th onClick={this.toggleSortState} className="description">Description</th>
                    <th onClick={this.toggleSortState} className="category">Category</th>
                    <th onClick={this.toggleSortState} className="amount">Amount</th>
                  </tr>
                </thead>
                <tbody className="transaction-table-body">
                  {mappedBody}
                </tbody>
              </table>
            </section>
          </main>
          <Footer />
        </div>);
    }

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

  filterTransactionsByType: function () {
    var newTransactions = [];
    this.state.transactions.forEach(function(transaction) {
      if (transaction.account_type === this.state.filterAccountType) {
        newTransactions.push(transaction);
      }
    }.bind(this));
    return newTransactions;
  },

  toggleSortState: function (e) {
    var column = e.target.className;


    if (column === "date") {

      this.setState({sortDate: true, sortDateASC: !this.state.sortDateASC, sortCat: false, sortDesc: false, sortAmount: false});
    } else if (column === "description") {
      this.setState({sortDate: false, sortCat: false, sortDesc: true, sortDescASC: !this.state.sortDescASC, sortAmount: false});
    } else if (column === "category") {
      this.setState({sortDate: false, sortCat: true, sortCatASC: !this.state.sortCatASC, sortDesc: false, sortAmount: false});
    } else if( column === "amount") {
      this.setState({sortDate: false, sortCat: false, sortDesc: false, sortAmount: true, sortAmountASC: !this.state.sortAmountASC});
    }
  },

  sortDesc: function () {
    var transactions = this.state.transactions;
    if (this.state.sortDescASC) {
      return (
        transactions.sort(function(a,b) {
          return a.description.toLowerCase().localeCompare(b.description.toLowerCase());
        })
      );
    } else {
      return (
        transactions.sort(function(a,b) {
         return b.description.toLowerCase().localeCompare(a.description.toLowerCase());
       })
      );
    }
  },

  sortDate: function () {
    var transactions = this.state.transactions;
    if (this.state.sortDateASC) {
      return (
        transactions.sort(function(a,b) {
          return new Date(a.date) - new Date(b.date);
        })
      );
    } else {
      return (
        transactions.sort(function(a,b) {
          return new Date(b.date) - new Date(a.date);
        })
      );
    }
  },

  sortCat: function () {
    var transactions = this.state.transactions;

    if (this.state.sortCatASC) {
      return (
        transactions.sort(function(a,b) {
          return a.category.toLowerCase().localeCompare(b.category.toLowerCase());
        })
      );
    } else {
      return (
        transactions.sort(function(a,b) {
          return b.category.toLowerCase().localeCompare(a.category.toLowerCase());
        })
      );
    }
  },

  sortAmount: function () {
    var transactions = this.state.transactions;

    if (this.state.sortAmountASC) {
      return (
        transactions.sort(function(a,b) {
          return a.amount_n - b.amount_n;
        })
      );
    } else {
      return (
        transactions.sort(function(a,b) {
          return b.amount_n - a.amount_n;
        })
      );
    }
  },

  accountShowSidebar: function () {
    return (
      <AccountShowSidebar
        accountTypeClick={this.handleAccountTypeClick}
        accountId={this.props.params.accountId}
        accounts={this.state.allAccounts}
        accountClick={this.handleAccountClick}
        transactionsClick={this.handleTransactionsClick}
        />
    );
  },

  headerText: function () {
    var account = this.state.account,
        filterAccountType = this.state.filterAccountType,
        balanceClass;

    if (!filterAccountType) {

      balanceClass = (account.balance_n > 0) ? "" : "neg";
      return (
        <header>
          <h1>{account.name}</h1>
          <h6>TOTAL BALANCE</h6>
          <h5 className={balanceClass}>{accounting.formatMoney(account.balance_n)}</h5>
        </header>
      );
    } else {
      balanceClass = (this.typeBalance > 0) ? "" : "neg";
      return (
        <header>
          <h1>All {filterAccountType} Accounts</h1>
          <h6>TOTAL BALANCE</h6>
          <h5 className={balanceClass}>{accounting.formatMoney(this.typeBalance)}</h5>
        </header>
      );
    }
  },

  mapBody: function (transactions) {
    var that = this;

    var mappedBody = transactions.map(function(transaction, index) {
      if (index === that.state.formIndex) {
        return (
          <TransactionItemForm
              transaction={transaction}
              key={index} /> );
      } else {
        return (
          <TransactionIndexItem
            index={index}
            onClick={that.makeFormIndex.bind(null, index)}
            transaction={transaction}
            key={index} /> );
      }
    });

    return mappedBody;
  },

  resultText: function (transactions, firstResult, totalCount, lastResult) {
    var buttonNext = "",
        page = this.state.page,
        inSearch = this.state.inSearch,
        filterAccountType = this.state.filterAccountType;

    var buttonBack = (page > 1) ? <button onClick={this.backPage}> Back </button> : "";

    if (totalCount > (25 * page)) {
      buttonNext = <button onClick={this.nextPage}>Next </button>;
      }

    if ( filterAccountType ) {
      if (!inSearch) {
        return "";
      } else {
        return (
          <div className="search-result-text">
            <p>Showing { firstResult + 1 } - { lastResult }  of { totalCount } transactions {buttonBack} {buttonNext}</p>
          </div>
        );
      }
    } else if (inSearch) {
      if (transactions.length === 0) {
        return (
          <div className="search-result-text">
            <p>No results for "{this.state.query}". Try searching for something else.</p>
          </div>
        );
      } else {
        return (
          <div className="search-result-text">
            <p>Showing { transactions.length } out of { totalCount } transactions that match "{this.state.query}" {buttonBack} {buttonNext}</p>
          </div>
        );
      }
    } else {
      return (
        <div className="search-result-text">
          <p>Showing { firstResult + 1 } - { lastResult } of { totalCount } transactions {buttonBack} {buttonNext}</p>
        </div>
      );
    }
  }

});


module.exports = AccountShow;
