var React = require('react'),
    History = require('react-router').History;

var TransactionStore = require('../stores/transaction'),
    ApiUtil  = require('../util/api_util'),
    TransactionIndexItem = require('./transaction_index_item'),
    TransactionItemForm = require('./transaction_form'),
    Search = require('./search');

var TransactionIndex = React.createClass({
  mixins: [History],

  getInitialState: function () {

    return {
      transactions: TransactionStore.all(),
      formIndex: 0,
      inSearch: false,
      totalCount: TransactionStore.all().length,
      query: null,
      page: 1,
      filterAccountType: this.props.filterAccountType || false,
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
    ApiUtil.fetchTransactions();
    this.storeListener = TransactionStore.addListener(this.onChange);
  },

  nextPage: function () {
    var nextPage = this.state.page + 1;
    this.setState({page: nextPage});
  },

  backPage: function () {
    var backPage = this.state.page - 1;
    this.setState({page: backPage});
  },

  onChange: function () {
    if (this.state.inSearch) {
      var transactions = this.findNewTransactions();
      this.setState({
        transactions: transactions,
        totalCount: transactions.length
      });
    } else {
      this.setState({
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
    this.storeListener.remove();
  },

  componentWillReceiveProps: function (newProps) {
    this.setState({
      inSearch: false,
      filterAccountType: newProps.filterAccountType || false
    });
  },

  makeFormIndex: function (index) {
    this.setState({formIndex: index});
  },

  handleSearch: function (transactions, query, totalCount) {
    if (query !== "")
      this.setState({
        transactions: transactions,
        query: query,
        inSearch: true,
        totalCount: totalCount,
        page: 1});
    else {
      this.setState({
        transactions: TransactionStore.all(),
        inSearch: false,
        page: 1,
        totalCount: TransactionStore.all().length});
    }
  },


  render: function () {

    var transactions = this.state.transactions;

    if (this.state.sortDate) {
      transactions = this.sortDate();
    } else if (this.state.sortCat) {
      transactions = this.sortCat();
    } else if (this.state.sortDesc) {
      transactions = this.sortDesc();
    } else if (this.state.sortAmount) {
      transactions = this.sortAmount();
    }

    var that = this,
        page = this.state.page,
        firstResult = (page - 1) * 25,
        lastResult = (this.state.transactions.length > firstResult + 25) ? firstResult + 25 : this.state.transactions.length,
        totalCount = this.state.totalCount,
        search =  <Search search={this.handleSearch} />;

    transactions = this.state.transactions.slice( firstResult, lastResult );


    if (this.state.filterAccountType) {
      var newTransactions = this.filterTransactionsByType();
      lastResult = (newTransactions.length > firstResult + 25) ? firstResult + 25 : newTransactions.length;
      transactions = newTransactions.slice(firstResult, lastResult);
      totalCount = newTransactions.length;
    }

    var mappedBody = this.mapBody(transactions);
    var resultText = this.resultText(transactions, firstResult, totalCount, lastResult);

    return (
      <div className="group">
        {search}
        {resultText}
        <table className="transaction-table">
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
      </div>
    );
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

  filterTransactionsByType: function () {
    var newTransactions = [];
    this.state.transactions.forEach(function(transaction) {
      if (transaction.account_type === this.state.filterAccountType) {
        newTransactions.push(transaction);
      }
    }.bind(this));
    return newTransactions;
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
      return (
        <div className="search-result-text">
          <p>Showing { firstResult + 1 } - { lastResult }  of { totalCount } transactions {buttonBack} {buttonNext}</p>
        </div>
      );
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

module.exports = TransactionIndex;
