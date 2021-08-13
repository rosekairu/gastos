var Store = require('flux/utils').Store;

var AppDispatcher = require('../dispatcher/dispatcher'),
    AccountConstants = require('../constants/account');


var _accounts = {};
var _accountsIdx = {};

var _accountSetup = function () {
  AccountConstants.ACCOUNT_TYPES.forEach(function(type){
    _accounts[type] = [];
  });
};

_accountSetup();


var resetAccounts = function (accounts) {
  _accountSetup();
  accounts.forEach(function(account) {
    _accounts[account.account_type].push(account);
    _accountsIdx[account.id] = account;
  });
};

var removeAccount = function (account) {
  var type = account.account_type;
  var idx = -1;

  for (var i = 0; i < _accounts[type].length; i++) {
    if (_accounts[type][i].id === account.id) {
      idx = i;
    }
  }

  if (idx !== -1) {
    _accounts[type].splice(idx, 1);
  }

  delete _accountsIdx[account.id];


};

var addAccount = function (account) {
  _accountsIdx[account.id] = $.extend({}, _accountsIdx[account.id], account);

  var accountTypeArray = _accounts[account.account_type];
  var idx = -1;

  for (var i = 0; i < accountTypeArray.length; i++) {
    if (accountTypeArray[i].id === account.id) {
      idx = i;
    }
  }

  if (idx === -1) {
    _accounts[account.account_type].push(account);
  } else {
    _accounts[account.account_type][idx] = $.extend({}, _accounts[account.account_type][idx], account);
  }

};

var AccountStore = new Store(AppDispatcher);

AccountStore.all = function () {
  return $.extend({}, _accounts);

};

AccountStore.allByIdx = function () {
  return $.extend({}, _accountsIdx);

};

AccountStore.find = function (id) {
  return _accountsIdx[id];
};




AccountStore.__onDispatch = function (payload) {

  switch(payload.actionType) {
    case AccountConstants.ACCOUNTS_RECEIVED:
      resetAccounts(payload.accounts);
      AccountStore.__emitChange();
      break;
    case AccountConstants.ACCOUNT_RECEIVED:
      addAccount(payload.account);
      AccountStore.__emitChange();
      break;
    case AccountConstants.ACCOUNT_RETRIEVED:
      addAccount(payload.account);
      AccountStore.__emitChange();
      break;
    case AccountConstants.ACCOUNT_REMOVED:
      removeAccount(payload.account);
      AccountStore.__emitChange();
      break;
  }
};





module.exports = AccountStore;
