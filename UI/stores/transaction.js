var Store = require('flux/utils').Store;

var AppDispatcher = require('../dispatcher/dispatcher'),
    TransactionConstants = require('../constants/transaction');

var _transactions = [];
var _transactionsIdx = {};
var _transactionsByAccountId = {};
var _meta = {};

var TransactionStore = new Store(AppDispatcher);

TransactionStore.all = function () {
  return _transactions.slice();
};

TransactionStore.meta = function () {
  return _meta;
};

var resetTransactions = function (transactions) {
  _transactions = transactions.slice();
  transactions.forEach(function(transaction) {
    _transactionsIdx[transaction.id] = transaction;
    if (typeof _transactionsByAccountId[transaction.account_id] === "undefined") {
      _transactionsByAccountId[transaction.account_id] = [];
    }
    _transactionsByAccountId[transaction.account_id].push(transaction);
  });
};

var resetAccountTransactions = function (transactions) {
  transactions.forEach(function(transaction) {
    _transactionsIdx[transaction.id] = transaction;
  });
};

TransactionStore.find = function (id) {
  return _transactionsIdx[id];
};

var addTransaction = function (transaction) {
  _transactionsIdx[transaction.id] = transaction;

  var idx = -1;

  for (var i = 0; i < _transactions.length; i++) {
    if (_transactions[i].id === transaction.id) {
      idx = i;
    }
  }

  if (idx === -1) {
    _transactions.push(transaction);
  } else {
    _transactions[idx] = transaction;
  }

};


TransactionStore.__onDispatch = function (payload) {
  switch(payload.actionType) {
    case TransactionConstants.TRANSACTIONS_RECEIVED:
      resetTransactions(payload.transactions);
      _meta = payload.meta;
      TransactionStore.__emitChange();
      break;
    case TransactionConstants.TRANSACTION_RECEIVED:
      addTransaction(payload.transaction);
      TransactionStore.__emitChange();
      break;
    case TransactionConstants.ACCOUNT_TRANSACTIONS_RECEIVED:
      resetTransactions(payload.transactions);
      TransactionStore.__emitChange();
      break;
  }
};


module.exports = TransactionStore;
