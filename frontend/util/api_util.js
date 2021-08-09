var ApiActions = require('../actions/api'),
    FlashActions = require("../actions/flash_actions");

var ApiUtil = {
  fetchAccounts: function () {
    $.ajax({
     type: "get",
     url: "/api/accounts",
     dataType: "json",
     success: function (accounts) {
       ApiActions.receiveAllAccounts(accounts);
     }
   });

  },

  fetchAccount: function (id) {
    $.ajax({
     type: "get",
     url: "/api/accounts/" + id,
     dataType: "json",
     success: function (account) {
       ApiActions.retrieveAccount(account);
     }
   });

  },

  fetchTransactions: function () {
    $.ajax({
     type: "get",
     url: "/api/transactions",
     dataType: "json",
     success: function (transactions) {
       ApiActions.receiveAllTransactions(transactions);
     }
   });

  },

  fetchAccountTransactions: function (accountId) {
    $.ajax({
     type: "get",
     url: "/api/transactions",
     dataType: "json",
     success: function (transactions) {
       var accountTransactions = [];
       transactions.forEach(function(transaction) {
         if (transaction.account_id === parseInt(accountId)) {
           accountTransactions.push(transaction);
         }
       });

       ApiActions.receiveAccountTransactions(accountTransactions);
     }
   });

 },


  updateTransaction: function (transaction) {
    $.ajax({
     type: "patch",
     url: "/api/transactions/" + transaction.id,
     dataType: "json",
     data: {transaction: transaction},
     success: function () {
       ApiActions.receiveTransaction(transaction);
     },
     error: function (data) {

     }
   });

  },


  fetchInstitutions: function () {
    $.ajax({
     type: "get",
     url: "/api/institutions",
     dataType: "json",
     success: function (institutions) {
       ApiActions.receiveAllInstitutions(institutions);
     }
   });
  },

  createAccount: function (account, callback) {

    $.ajax({
      type: "post",
      url: "/api/accounts",
      dataType: "json",
      data: { account: account },
      success: function (account) {
        ApiActions.receiveAccount(account);
        callback && callback(account.id);
        console.log(account.id);
      },
      error: function (data) {
        FlashActions.receiveFlash(data.responseJSON.errors);
      }
    });
  },

  deleteAccount: function (account, callback) {
    $.ajax({
     type: "delete",
     url: "/api/accounts/" + account.id,
     dataType: "json",
     success: function () {
       ApiActions.removeAccount(account);
       callback && callback();
       console.log(account.id);
     },
     error: function (data) {
       
     }
   });

  }

};

module.exports = ApiUtil;
