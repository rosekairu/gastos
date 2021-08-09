var AppDispatcher = require('../dispatcher/dispatcher'),
    AccountConstants = require('../constants/account'),
    InstitutionConstants = require('../constants/institution'),
    TransactionConstants = require('../constants/transaction');

var ApiActions = {
  receiveAccount: function (account){
    AppDispatcher.dispatch({
      actionType: AccountConstants.ACCOUNT_RECEIVED,
      account: account
    });
  },

  removeAccount: function (account){
    AppDispatcher.dispatch({
      actionType: AccountConstants.ACCOUNT_REMOVED,
      account: account
    });
  },

  receiveAccountTransactions: function (transactions){
    AppDispatcher.dispatch({
      actionType: TransactionConstants.ACCOUNT_TRANSACTIONS_RECEIVED,
      transactions: transactions
    });
  },

  retrieveAccount: function (account){
    AppDispatcher.dispatch({
      actionType: AccountConstants.ACCOUNT_RETRIEVED,
      account: account
    });
  },

  receiveAllAccounts: function (accounts) {
    AppDispatcher.dispatch({
      actionType: AccountConstants.ACCOUNTS_RECEIVED,
      accounts: accounts
    });
  },

  receiveAllTransactions: function (transactions) {
    AppDispatcher.dispatch({
      actionType: TransactionConstants.TRANSACTIONS_RECEIVED,
      transactions: transactions,
      meta: {totalCount: transactions[0].total_count}
    });
  },

  receiveTransaction: function (transaction) {
    AppDispatcher.dispatch({
      actionType: TransactionConstants.TRANSACTION_RECEIVED,
      transaction: transaction
    });
  },

  receiveAllInstitutions: function (institutions) {
    AppDispatcher.dispatch({
      actionType: InstitutionConstants.INSTITUTIONS_RECEIVED,
      institutions: institutions
    });
  }

};

module.exports = ApiActions;
