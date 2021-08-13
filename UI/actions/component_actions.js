var React = require('react');

module.exports = {

  getOverviewClass: function (clicked) {
    if (clicked) {
      return "content-header-list-selected";
    } else {
      return "overview";
    }
  },

  getTopTransactionCategories: function (transactions) {
    var categoriesIdx = {};
    var catAmounts = {};
    var transCats = {};
    transactions.forEach(function(transaction) {
    if (transaction.category !== "UNCATEGORIZED") {
      if (!categoriesIdx[transaction.category]) {
        categoriesIdx[transaction.category] = [];
        catAmounts[transaction.category] = 0;
      }
      categoriesIdx[transaction.category] = transaction;
      catAmounts[transaction.category] += Math.abs(parseFloat(transaction.amount_n));
    }
  });

    var keysSorted = Object.keys(catAmounts).sort(function(a,b){return catAmounts[b] - catAmounts[a];}).slice(0, 5);
    keysSorted.forEach(function(category) {
      transCats[category] = catAmounts[category].toFixed(2);
    });

    return transCats;
  },

  getTransactionClass: function (clicked) {
    if (clicked) {
      return "content-header-list-selected";
    } else {
      return "transaction";
    }
  },

  generateBalance: function () {
    return Math.floor(Math.random() * (25000 + 3999) - 4000);
  },

  generateAccountType: function () {
    var types = ["Cash", "Credit Cards", "Loan", "Investments"];
    return types[Math.floor(Math.random() * types.length)];
  },

  getAccountTypes: function (accounts) {
    var accountTypes = [];

    Object.keys(accounts).forEach(function(accountType) {
      if ( accounts[accountType].length > 0 ) {
        accountTypes.push(accountType);
      }
    });

    return accountTypes;
  },

  totalAccountTypeBalance: function (accounts, accountType) {
    var sum = 0;
    accounts[accountType].forEach(function(account) {
      sum += parseFloat(account.balance_n);
    });

    return sum;
  },

  sliceAccountName: function (accountName) {
    if (accountName.length > 18) {
      return accountName.slice(0, 18) + "...";
    } else {
      return accountName;
    }
  },

  getAccountBalances: function (accounts) {
    var accountBalances = {};
    var that = this;
    Object.keys(accounts).forEach(function(accountType) {
      if ( accounts[accountType].length > 0 ) {
        accountBalances[accountType] = that.totalAccountTypeBalance(accounts, accountType);
      }
    });

    return accountBalances;
  },

  getAccountBalanceClass: function(accountBalance) {
    if (accountBalance > 0) {
      return "account-balance";
    } else {
      return "account-balance-neg group";
    }
  },

  getAccountsArr: function (accounts) {
    var accountsArr = [];

    Object.keys(accounts).forEach(function(accountType) {
      if ( accounts[accountType].length > 0 ) {
        accounts[accountType].forEach(function(account){
          accountsArr.push(account);
        });
      }
    });

    return accountsArr;
  },

  formatDate: function (datetime) {
    var dateArr = new Date(datetime).toDateString().split(" ");

    return dateArr[1].toUpperCase() + " " + dateArr[2];
  }

};
